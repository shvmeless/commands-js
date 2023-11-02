#!/usr/bin/env node
import { object as objectSchema, string as stringSchema, boolean as booleanSchema } from 'yup'
import { existsSync, readFileSync, statSync } from 'fs'
import { Argument, Option, program } from 'commander'
import { Version } from '../libs/common/Version'
import { parseToString } from '../utils/parser'
import * as record from '../utils/common'
import packageData from 'package-json'
import { join } from 'path'
import chalk from 'chalk'

// ARGUMENTS
const ARGS = {
  path: new Argument('[path]', 'Path to the `package.json` file.').default(process.cwd()),
  updates: new Option('-u, --updates', 'Displays only the dependencies that are not up to date.').default(false),
}

// MAIN
program
  .version('0.1.0')
  .description('Reads the dependencies from a `package.json` file and displays the latest `patch`, `minor`, and `major` versions available.')
  .addArgument(ARGS.path)
  .addOption(ARGS.updates)
  .action(async (path, opts) => {

    let packagePath = stringSchema().required().validateSync(path)

    const options = objectSchema({
      updates: booleanSchema().required(),
    }).required().validateSync(opts)

    if (!existsSync(packagePath)) throw new Error(`Path ${packagePath} does not exist`)

    const isDir = statSync(packagePath).isDirectory()
    if (isDir) packagePath = join(packagePath, 'package.json')

    const packageText = readFileSync(packagePath, 'utf8')

    const packageSchema = objectSchema({
      dependencies: objectSchema().default({}),
      devDependencies: objectSchema().default({}),
      peerDependencies: objectSchema().default({}),
      optionalDependencies: objectSchema().default({}),
    }).default({}).noUnknown()

    const packageJSON = packageSchema.validateSync(JSON.parse(packageText)) as Record<string, Record<string, string>>

    const groups = await record.map(packageJSON, async (group) => {
      return await record.map(group, async (dependency) => {
        const version = Version.fromString(dependency)
        if (version === null) return
        return version
      })
    })

    const checkUpdate = async (dependency: string, template: string): Promise<Version | null> => {
      const data = await packageData(dependency, { version: template })
      const versionStr = parseToString(data.version) ?? '0.0.0'
      return Version.fromString(versionStr)
    }

    await record.forEach(groups, async (dependencies, group) => {

      let isGroupInit = false

      await record.forEach(dependencies, async (version, dependency) => {
        try {

          const CURRENT_VERSION = version.copy()

          const patchVersion = await checkUpdate(dependency, `${version.major}.${version.minor}.x`) ?? CURRENT_VERSION
          const minorVersion = await checkUpdate(dependency, `${version.major}.x.x`) ?? CURRENT_VERSION
          const majorVersion = await checkUpdate(dependency, 'latest') ?? CURRENT_VERSION

          const output: string[] = []

          output.push(chalk.bold(dependency))
          output.push(chalk.bold.cyan(version))

          if (!patchVersion.comparePatch(version)) output.push(chalk.bold.green(patchVersion.toString()))
          if (!minorVersion.compareMinor(patchVersion)) output.push(chalk.bold.yellow(minorVersion.toString()))
          if (!majorVersion.compareMajor(minorVersion)) output.push(chalk.bold.red(majorVersion.toString()))

          if (options.updates && output.length <= 2) return

          if (!isGroupInit) {
            process.stdout.write(`\n${chalk.bold(`${group}:`)}\n\n`)
            isGroupInit = true
          }

          process.stdout.write(output.join(' » ') + '\n')

        } catch {
          process.stdout.write(chalk.red.bold(`${dependency} » Invalid Version!\n`))
        }
      })

    })

    process.stdout.write('\n')

  })

// RUN
program.parse()
