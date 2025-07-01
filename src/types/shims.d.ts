// TypeScript module declarations for missing type definitions

// Fallback for body-scroll-lock if types are still missing
declare module 'body-scroll-lock' {
  export function disableBodyScroll(element: HTMLElement): void;
  export function enableBodyScroll(element: HTMLElement): void;
  export function clearAllBodyScrollLocks(): void;
} 