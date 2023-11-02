// IMPORTS
import { type FilesystemItem } from '../libs/common/FilesystemItem'
import { basename, dirname, join } from 'path'
import { readdirSync, statSync } from 'fs'

// FUNCTION
export function read (path: string): FilesystemItem {

  const itemStats = statSync(path)

  let itemDirectories: number = 0
  let itemFiles: number = 0

  if (itemStats.isDirectory()) {
    const itemContent = readdirSync(path)
    for (const child of itemContent) {
      const childPath = join(path, child)
      const childStats = statSync(childPath)
      if (childStats.isDirectory()) itemDirectories++
      else itemFiles++
    }
  }

  return {
    name: basename(path),
    path,
    dirname: dirname(path),
    type: itemStats.isDirectory() ? 'DIR' : 'FILE',
    atime: itemStats.atime,
    birthtime: itemStats.birthtime,
    ctime: itemStats.ctime,
    size: itemStats.size,
    directories: itemDirectories,
    files: itemFiles,
  }

}
