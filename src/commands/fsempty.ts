#!/usr/bin/env node
import { Argument, program } from 'commander'
import { string as stringScheme } from 'yup'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

// ARGUMENTS
const ARGS = {
  path: new Argument('[path]', 'Initial directory path.').default(process.cwd()),
}

// MAIN
program
  .version('0.1.0')
  .description('Display a list of all empty directories found within the given path.')
  .addArgument(ARGS.path)
  .action(async (argPath) => {

    const targetPath = stringScheme().required().validateSync(argPath)

    const empty: string[] = []

    process.stdout.write('\n')

    const findEmptyDirectories = (path: string): void => {

      const content = readdirSync(path)

      if (content.length === 0) {
        empty.push(path)
        process.stdout.write(`${path}\n`)
      }

      for (const child of content) {

        const childPath = join(path, child)
        const childStats = statSync(childPath)

        if (childStats.isDirectory()) findEmptyDirectories(childPath)

      }

    }

    findEmptyDirectories(targetPath)

    process.stdout.write(`\n${chalk.yellow.bold(empty.length)} empty directories found!\n\n`)

  })

// RUN
program.parse()
