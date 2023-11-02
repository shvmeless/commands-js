// FUNCTION
export function entries <K extends string, V> (object: Record<K, V>): [K, V][] {
  return Object.entries(object) as [K, V][]
}

// FUNCTION
export function length (object: Record<string, unknown>): number {
  return Object.keys(object).length
}

// FUNCTION
export async function forEach <K extends string, V> (object: Record<K, V>, callback: (value: V, key: K) => Promise<void>): Promise<void> {
  for (const [key, value] of entries(object)) {
    await callback(value, key)
  }
}

// FUNCTION
export async function map <K extends string, V, N> (object: Record<K, V>, callback: (value: V, key: K) => Promise<N | undefined>): Promise<Record<K, N>> {
  const result: Record<string, N> = {}
  for (const [key, value] of entries(object)) {
    const item = await callback(value, key)
    if (item === undefined) continue
    result[key] = item
  }
  return result as Record<K, N>
}
