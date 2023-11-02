#!/usr/bin/env node
import { boolean as booleanSchema, object as objectSchema, string } from 'yup'
import { type FilesystemItem } from '../libs/common/FilesystemItem'
import { Argument, Option, program } from 'commander'
import * as filesystem from '../utils/filesystem'
import { existsSync, readdirSync } from 'fs'
import formatter from '../utils/formatter'
import { dirname, join } from 'path'
import stripAnsi from 'strip-ansi'
import chalk from 'chalk'

// ARGUMENTS
const args = {
  path: new Argument('[path]', 'Path to directory.').default(process.cwd()),
  files: new Option('--no-files', 'Ignores the files.').default(true),
  dirs: new Option('--no-dirs', 'Ignores the directories.').default(true),
}

// MAIN
program
  .version('0.0.1')
  .description('Lists the details of the files and directories found in the given path.')
  .addArgument(args.path)
  .addOption(args.files)
  .addOption(args.dirs)
  .action(async (argPath, opts) => {

    const targetPath = string().required().validateSync(argPath)
    const parentPath = dirname(targetPath)

    const options = objectSchema({
      files: booleanSchema().required(),
      dirs: booleanSchema().required(),
    }).required().validateSync(opts)

    if (!existsSync(targetPath)) throw new Error(`Path does not exist: ${targetPath}`)
    if (!existsSync(parentPath)) throw new Error(`Path does not exist: ${parentPath}`)

    const targetItem = filesystem.read(targetPath)
    const parentItem = filesystem.read(parentPath)

    targetItem.name = '.'
    parentItem.name = '..'

    const directories: FilesystemItem[] = []
    const files: FilesystemItem[] = []

    const targetContent = readdirSync(targetPath)

    for (const child of targetContent) {

      const childPath = join(targetPath, child)
      const item = filesystem.read(childPath)

      if (item.type === 'DIR' && options.dirs) directories.push(item)
      else if (options.files) files.push(item)

    }

    const header = {
      ctime: chalk.bold('Modified'),
      birthtime: chalk.bold('Created'),
      size: chalk.bold('Size'),
      name: chalk.bold('Name'),
    }

    const widths = {
      ctime: stripAnsi(header.ctime).length,
      birthtime: stripAnsi(header.birthtime).length,
      size: stripAnsi(header.size).length,
      name: stripAnsi(header.name).length,
    }

    const items = [directories, files, [parentItem, targetItem]]
    const table = items.map((group) => {
      return group.map((item) => {

        const ctime = formatter.datetime(item.ctime)
        const birthtime = formatter.datetime(item.birthtime)
        const size = (item.type === 'FILE') ? formatter.bytes(item.size) : `${item.directories} D ${item.files} F`
        let name = (item.type === 'DIR') ? item.name + '/' : item.name

        name = chalk.bold(name)

        widths.ctime = Math.max(widths.ctime, stripAnsi(ctime).length)
        widths.birthtime = Math.max(widths.birthtime, stripAnsi(birthtime).length)
        widths.size = Math.max(widths.size, stripAnsi(size).length)
        widths.name = Math.max(widths.name, stripAnsi(name).length)

        return { ctime, birthtime, size, name }

      })
    })

    table.unshift([header])

    table.forEach((group) => {

      group.forEach((item) => {

        item.ctime = formatter.padding(item.ctime, widths.ctime, 'LEFT')
        item.birthtime = formatter.padding(item.birthtime, widths.birthtime, 'LEFT')
        item.size = formatter.padding(item.size, widths.size, 'RIGHT')
        item.name = formatter.padding(item.name, widths.name, 'LEFT')

        process.stdout.write(`${item.ctime}  ${item.birthtime}  ${item.size}  ${item.name}\n`)

      })

      if (group.length > 0) process.stdout.write('\n')

    })

  })

// RUN
program.parse()
