#!/usr/bin/env node
import { Argument, program } from 'commander'
import { string as stringScheme } from 'yup'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

// ARGUMENTS
const args = {
  search: new Argument('<search>', 'Text to search.'),
  path: new Argument('[path]', 'Target directory path.').default(process.cwd()),
}

// MAIN
program
  .version('0.1.0')
  .description('Display a list of items whose names match the given text.')
  .addArgument(args.search)
  .addArgument(args.path)
  .action(async (argSearch, argPath) => {

    const search = stringScheme().required().validateSync(argSearch)
    const targetPath = stringScheme().required().validateSync(argPath)

    const fuzzy = (text: string, query: string): boolean => {

      text = text.replace(/\s/g, '').toLowerCase()
      query = query.replace(/\s/g, '').toLowerCase()

      let i = 0
      let j = 0

      while ((i < text.length) && (j < query.length)) {
        if (text[i] === query[j]) j++
        i++
      }

      return j === query.length

    }

    let count = 0

    const searchOnDirectory = (path: string): void => {

      const content = readdirSync(path)

      for (const child of content) {

        const childPath = join(path, child)
        const childStats = statSync(childPath)

        if (fuzzy(child, search)) {
          process.stdout.write(`${childPath}\n`)
          count++
        }

        if (childStats.isDirectory()) searchOnDirectory(childPath)

      }

    }

    searchOnDirectory(targetPath)

    process.stdout.write(`\n${chalk.bold.green(count)} items found!\n\n`)

  })

// RUN
program.parse()
