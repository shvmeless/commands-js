// FUNCTION
export function parseToString (value: any): string | null {

  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'boolean') return value ? 'true' : 'false'

  return null

}

// FUNCTION
export function parseToInteger (value: any): number | null {

  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value !== 'string') return null

  const match = value.match(/-?\d+/)
  if (match === null) return null

  return parseInt(match[0])

}
