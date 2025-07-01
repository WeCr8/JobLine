// Locale-aware sorting
export function localeSort<T>(arr: T[], key?: keyof T, locale = navigator.language): T[] {
  if (key) {
    return arr.slice().sort((a, b) =>
      String(a[key]).localeCompare(String(b[key]), locale)
    )
  }
  return (arr as unknown as string[]).slice().sort((a, b) =>
    String(a).localeCompare(String(b), locale)
  ) as T[]
}

// Pluralization
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular
  return plural || singular + 's'
}

// Date localization
export function localizeDate(date: Date | string, locale = navigator.language, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, options)
}

// Number localization
export function localizeNumber(num: number, locale = navigator.language, options?: Intl.NumberFormatOptions): string {
  return num.toLocaleString(locale, options)
} 