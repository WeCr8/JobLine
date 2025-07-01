import { ref, watch } from 'vue';
// Persistent state composable (sync with localStorage)
export function usePersistentState(key, defaultValue) {
    const stored = localStorage.getItem(key);
    const state = ref(stored ? JSON.parse(stored) : defaultValue);
    watch(state, (val) => {
        localStorage.setItem(key, JSON.stringify(val));
    }, { deep: true });
    return state;
}
// Undo/redo stack
export class UndoRedoStack {
    stack = [];
    pointer = -1;
    constructor(initial) {
        this.push(initial);
    }
    get canUndo() {
        return this.pointer > 0;
    }
    get canRedo() {
        return this.pointer < this.stack.length - 1;
    }
    get value() {
        return this.stack[this.pointer];
    }
    push(val) {
        // Remove redo history
        this.stack = this.stack.slice(0, this.pointer + 1);
        this.stack.push(val);
        this.pointer = this.stack.length - 1;
    }
    undo() {
        if (this.canUndo)
            this.pointer--;
        return this.value;
    }
    redo() {
        if (this.canRedo)
            this.pointer++;
        return this.value;
    }
    reset(val) {
        this.stack = [val];
        this.pointer = 0;
    }
}
// Reactive deep watch helper
export function deepWatch(source, cb, options = {}) {
    return watch(source, cb, { ...options, deep: true });
}
