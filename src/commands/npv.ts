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
  patch: new Option('--no-patch', 'Ignore `patch` versions when checking for updates.').default(true),
  minor: new Option('--no-minor', 'Ignore `minor` versions when checking for updates.').default(true),
  major: new Option('--no-major', 'Ignore `major` versions when checking for updates.').default(true),
}

// MAIN
program
  .version('0.1.0')
  .description('Reads the dependencies from a `package.json` file and displays the latest `patch`, `minor`, and `major` versions available.')
  .addArgument(ARGS.path)
  .addOption(ARGS.updates)
  .addOption(ARGS.patch)
  .addOption(ARGS.minor)
  .addOption(ARGS.major)
  .action(async (path, opts) => {

    let packagePath = stringSchema().required().validateSync(path)

    const options = objectSchema({
      updates: booleanSchema().required(),
      patch: booleanSchema().required(),
      minor: booleanSchema().required(),
      major: booleanSchema().required(),
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

          const patchVersion = (options.patch) ? await checkUpdate(dependency, `${version.major}.${version.minor}.x`) ?? CURRENT_VERSION : CURRENT_VERSION
          const minorVersion = (options.minor) ? await checkUpdate(dependency, `${version.major}.x.x`) ?? CURRENT_VERSION : CURRENT_VERSION
          const majorVersion = (options.major) ? await checkUpdate(dependency, 'latest') ?? CURRENT_VERSION : CURRENT_VERSION

          const output: string[] = []

          output.push(chalk.bold(dependency))
          output.push(chalk.bold.cyan(version))

          if (options.patch && !patchVersion.comparePatch(version)) output.push(chalk.bold.green(patchVersion.toString()))
          if (options.minor && !minorVersion.compareMinor(patchVersion)) output.push(chalk.bold.yellow(minorVersion.toString()))
          if (options.major && !majorVersion.compareMajor(minorVersion)) output.push(chalk.bold.red(majorVersion.toString()))

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
