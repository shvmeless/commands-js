// IMPORTS
import stripAnsi from 'strip-ansi'

// MODULE
const formatter = {

  // FUNCTION
  datetime (value: Date): string {

    const language = Intl.DateTimeFormat().resolvedOptions().locale

    const date = value.toLocaleDateString(language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    const time = value.toLocaleTimeString(language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    return `${date} ${time}`

  },

  // FUNCTION
  bytes (value: number): string {

    if (value >= 1024 * 1024 * 1024) {
      const size = Math.round(value / 1024 / 1024 / 1024 * 100) / 100
      return `${size} GB`
    }

    if (value >= 1024 * 1024) {
      const size = Math.round(value / 1024 / 1024 * 100) / 100
      return `${size} MB`
    }

    if (value >= 1024) {
      const size = Math.round(value / 1024 * 100) / 100
      return `${size} KB`
    }

    return `${value}  B`

  },

  // FUNCTION
  padding (str: string, width: number, alignment: 'LEFT' | 'RIGHT'): string {

    const strWidth = stripAnsi(str).length

    if (alignment === 'LEFT') return str + ' '.repeat(width - strWidth)
    return ' '.repeat(width - strWidth) + str

  },

}

// EXPORT
export default formatter
