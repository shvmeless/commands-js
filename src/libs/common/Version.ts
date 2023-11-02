// IMPORTS
import { parseToInteger } from '../../utils/parser'

// CLASS
export class Version {

  // PROPERTIES
  public major: number
  public minor: number
  public patch: number

  // CONSTRUCTOR
  constructor (major: number, minor: number, patch: number) {
    this.major = major
    this.minor = minor
    this.patch = patch
  }

  // STATIC
  public static fromString (version: string): Version | null {

    const match = version.match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/)
    if (match === null) return null

    const major = parseToInteger(match[1]) ?? 0
    const minor = parseToInteger(match[2]) ?? 0
    const patch = parseToInteger(match[3]) ?? 0

    return new Version(major, minor, patch)

  }

  // METHOD
  public toString (): string {
    return `${this.major}.${this.minor}.${this.patch}`
  }

  // METHOD
  public copy (): Version {
    return new Version(this.major, this.minor, this.patch)
  }

  // METHOD
  public compareMajor (target: Version): boolean {

    return (this.major === target.major)

  }

  // METHOD
  public compareMinor (target: Version): boolean {

    if (this.major !== target.major) return false
    return (this.minor === target.minor)

  }

  // METHOD
  public comparePatch (target: Version): boolean {

    if (this.major !== target.major) return false
    if (this.minor !== target.minor) return false
    return (this.patch === target.patch)

  }

}
