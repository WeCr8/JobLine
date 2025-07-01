import { ref, watch, Ref, WatchCallback, WatchOptions, UnwrapRef } from 'vue'

// Persistent state composable (sync with localStorage)
export function usePersistentState<T>(key: string, defaultValue: T): Ref<UnwrapRef<T>> {
  const stored = localStorage.getItem(key)
  const state = ref<T>(stored ? JSON.parse(stored) : defaultValue)
  watch(state, (val) => {
    localStorage.setItem(key, JSON.stringify(val))
  }, { deep: true })
  return state as Ref<UnwrapRef<T>>
}

// Undo/redo stack
export class UndoRedoStack<T> {
  private stack: T[] = []
  private pointer = -1

  constructor(initial: T) {
    this.push(initial)
  }

  get canUndo() {
    return this.pointer > 0
  }
  get canRedo() {
    return this.pointer < this.stack.length - 1
  }
  get value(): T {
    return this.stack[this.pointer]
  }
  push(val: T) {
    // Remove redo history
    this.stack = this.stack.slice(0, this.pointer + 1)
    this.stack.push(val)
    this.pointer = this.stack.length - 1
  }
  undo() {
    if (this.canUndo) this.pointer--
    return this.value
  }
  redo() {
    if (this.canRedo) this.pointer++
    return this.value
  }
  reset(val: T) {
    this.stack = [val]
    this.pointer = 0
  }
}

// Reactive deep watch helper
export function deepWatch<T>(
  source: Ref<T>,
  cb: WatchCallback<T, T>,
  options: Omit<WatchOptions<boolean>, 'deep'> = {}
) {
  return watch(source, cb, { ...options, deep: true })
} 