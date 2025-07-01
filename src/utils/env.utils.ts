// Environment detection
export function getEnv(): 'development' | 'production' | 'test' {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.MODE === 'development') return 'development'
    if (import.meta.env.MODE === 'test') return 'test'
    return 'production'
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.NODE_ENV === 'development') return 'development'
    if (process.env.NODE_ENV === 'test') return 'test'
    return 'production'
  }
  return 'production'
}

export function isDev() {
  return getEnv() === 'development'
}
export function isProd() {
  return getEnv() === 'production'
}
export function isTest() {
  return getEnv() === 'test'
}

// Feature flag system
const FEATURE_FLAG_KEY = 'feature_flags'

export type FeatureFlags = Record<string, boolean>

function getStoredFlags(): FeatureFlags {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(FEATURE_FLAG_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setStoredFlags(flags: FeatureFlags) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(FEATURE_FLAG_KEY, JSON.stringify(flags))
  } catch {}
}

let flags: FeatureFlags = getStoredFlags()

export function enableFeature(flag: string) {
  flags[flag] = true
  setStoredFlags(flags)
}
export function disableFeature(flag: string) {
  flags[flag] = false
  setStoredFlags(flags)
}
export function isFeatureEnabled(flag: string): boolean {
  // .env override
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const envFlag = import.meta.env[`VITE_FEATURE_${flag.toUpperCase()}`]
    if (envFlag !== undefined) {
      return envFlag === 'true' || envFlag === true
    }
  }
  return !!flags[flag]
}
export function getAllFeatureFlags(): FeatureFlags {
  return { ...flags }
} 