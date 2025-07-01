// TypeScript module declarations for missing type definitions

declare module 'focus-trap' {
  const createFocusTrap: any;
  export = createFocusTrap;
}

declare module 'hammerjs' {
  const Hammer: any;
  export = Hammer;
}

// Fallback for body-scroll-lock if types are still missing
declare module 'body-scroll-lock' {
  export function disableBodyScroll(element: HTMLElement): void;
  export function enableBodyScroll(element: HTMLElement): void;
  export function clearAllBodyScrollLocks(): void;
} 