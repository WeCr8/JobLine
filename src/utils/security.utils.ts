// XSS-safe HTML escaping
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Input sanitization (basic, strips script/style tags and dangerous attributes)
export function sanitizeInput(str: string): string {
  // Remove script/style tags
  let sanitized = str.replace(/<\/?(script|style)[^>]*>/gi, '')
  // Remove on* attributes (e.g., onclick)
  sanitized = sanitized.replace(/ on\w+\s*=\s*(['"]).*?\1/gi, '')
  // Remove javascript: and data: URIs
  sanitized = sanitized.replace(/(javascript:|data:)/gi, '')
  return sanitized
}

// JWT decode (no validation, just decode payload)
export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

// JWT validate (exp, nbf, iat)
export function isJwtValid(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return false
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && now > payload.exp) return false
  if (payload.nbf && now < payload.nbf) return false
  if (payload.iat && now < payload.iat) return false
  return true
} 