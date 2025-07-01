// requestAnimationFrame throttling
export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let ticking = false
  let lastArgs: any[]
  // @ts-ignore
  return function (...args: any[]) {
    lastArgs = args
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...lastArgs)
        ticking = false
      })
      ticking = true
    }
  } as T
}

// Smooth scroll to element or position
export function smoothScrollTo(target: HTMLElement | number, options?: ScrollToOptions) {
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth', ...options })
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// CSS class toggling with animation support
export function toggleClass(el: HTMLElement, className: string, force?: boolean) {
  if (typeof force === 'boolean') {
    el.classList.toggle(className, force)
  } else {
    el.classList.toggle(className)
  }
}

// Animate class (add, then remove after animation ends)
export function animateClass(el: HTMLElement, className: string) {
  el.classList.add(className)
  function remove() {
    el.classList.remove(className)
    el.removeEventListener('animationend', remove)
    el.removeEventListener('transitionend', remove)
  }
  el.addEventListener('animationend', remove)
  el.addEventListener('transitionend', remove)
} 