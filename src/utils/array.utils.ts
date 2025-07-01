// Deep clone (using structuredClone if available, fallback to JSON)
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj)
  }
  return JSON.parse(JSON.stringify(obj))
}

// Deep merge (simple recursive merge)
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const output = { ...target } as T & U
  for (const key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge((output as any)[key] || {}, source[key])
    } else {
      output[key] = source[key] as any
    }
  }
  return output
}

// Deep equality
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false
    }
    return true
  }
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!deepEqual(a[key], b[key])) return false
  }
  return true
}

// Array chunk
export function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res
}

// Array shuffle (Fisher-Yates)
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Unique (by value)
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

// Intersection
export function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b)
  return a.filter(x => setB.has(x))
}

// Difference
export function difference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b)
  return a.filter(x => !setB.has(x))
} 