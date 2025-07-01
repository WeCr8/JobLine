// API response mocking (fetch override)
export function mockFetch(response: any, status = 200, delay = 0) {
  const originalFetch = window.fetch
  window.fetch = async (...args) => {
    await new Promise((res) => setTimeout(res, delay))
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => response,
      text: async () => JSON.stringify(response),
      clone() { return this },
      headers: { get: () => null },
      url: typeof args[0] === 'string' ? args[0] : '',
    } as unknown as Response)
  }
  return () => { window.fetch = originalFetch }
}

// Random data generators (simple, for e2e/unit tests)
export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}
export function randomInt(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export function randomEmail(): string {
  return `${randomString(5)}@${randomString(5)}.com`
}
export function randomPhone(): string {
  return `555${randomInt(1000000, 9999999)}`
}
export function randomDate(start = new Date(2000, 0, 1), end = new Date()): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Test ID helpers (for e2e selectors)
export function testId(id: string): string {
  return `[data-testid='${id}']`
}
export function setTestId(el: HTMLElement, id: string) {
  el.setAttribute('data-testid', id)
} 