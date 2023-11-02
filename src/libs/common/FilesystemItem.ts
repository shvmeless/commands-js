// EXPORT
export interface FilesystemItem {
  name: string
  path: string
  dirname: string
  type: 'FILE' | 'DIR'
  atime: Date
  birthtime: Date
  ctime: Date
  size: number
  directories: number
  files: number
}
