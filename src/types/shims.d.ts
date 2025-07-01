// TypeScript module declarations for missing type definitions

// Fallback for body-scroll-lock if types are still missing
declare module 'body-scroll-lock' {
  export function disableBodyScroll(element: HTMLElement): void;
  export function enableBodyScroll(element: HTMLElement): void;
  export function clearAllBodyScrollLocks(): void;
}

// Workaround for Workbox ExtendableEvent type leak
// This is safe for the main app build
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExtendableEvent extends Event {} 