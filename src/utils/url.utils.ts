// Query string parse
export function parseQueryString(query: string): Record<string, string> {
  if (query.startsWith('?')) query = query.slice(1)
  return Object.fromEntries(new URLSearchParams(query))
}

// Query string stringify
export function stringifyQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  return (
    '?' +
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
  )
}

// Safe URL building
export function buildUrl(base: string, params?: Record<string, string | number | boolean | undefined | null>, hash?: string): string {
  let url = base
  if (params && Object.keys(params).length > 0) {
    url += stringifyQueryString(params)
  }
  if (hash) {
    url += `#${encodeURIComponent(hash)}`
  }
  return url
}

// Get hash/anchor from URL
export function getHash(url: string): string | null {
  const idx = url.indexOf('#')
  return idx >= 0 ? decodeURIComponent(url.slice(idx + 1)) : null
}

// Set hash/anchor on URL
export function setHash(url: string, hash: string): string {
  const idx = url.indexOf('#')
  return (idx >= 0 ? url.slice(0, idx) : url) + '#' + encodeURIComponent(hash)
} 