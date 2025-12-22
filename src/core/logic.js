/**
 * Zypher Fold - Core Logic Engine
 * Contains: Stack DS, Diff Algorithm, and History Manager
 * "The Brain" of the application.
 */

/* --- 1. Generic Stack Data Structure --- */
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) { this.items.push(element); }
    pop() { return this.isEmpty() ? null : this.items.pop(); }
    peek() { return this.isEmpty() ? null : this.items[this.items.length - 1]; }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
    clear() { this.items = []; }
    toArray() { return [...this.items]; }
}

/* --- 2. Semantic Diff Algorithm --- */
const computeDiff = (oldText, newText) => {
    if (oldText === newText) return { type: 'NO_CHANGE', desc: 'No changes' };
    if (!oldText && newText) return { type: 'INSERT', desc: `Added ${newText.length} chars` };
    if (oldText && !newText) return { type: 'DELETE', desc: `Cleared ${oldText.length} chars` };

    const oldLen = oldText.length;
    const newLen = newText.length;

    if (newText.startsWith(oldText)) {
        const added = newText.slice(oldLen);
        const isPaste = added.length > 5;
        return {
            type: isPaste ? 'PASTE' : 'TYPING',
            desc: isPaste ? `Pasted "${added.slice(0, 10)}..."` : `Typed "${added}"`
        };
    }

    if (oldText.startsWith(newText)) {
        const deleted = oldText.slice(newLen);
        return { type: 'DELETE', desc: `Deleted "${deleted}"` };
    }

    let i = 0;
    while (i < oldLen && i < newLen && oldText[i] === newText[i]) i++;
    if (newText.slice(i).endsWith(oldText.slice(i))) {
        const added = newText.slice(i, newLen - (oldLen - i));
        return { type: 'INSERT', desc: `Inserted "${added}" at ${i}` };
    }

    return { type: 'EDIT', desc: `Modified text` };
};

/* --- 3. History Manager (Time Travel Core) --- */
export default class HistoryManager {
    constructor() {
        this.undoStack = new Stack();
        this.redoStack = new Stack();
        this.loadFromStorage();
    }

    // Persistence
    saveToStorage() {
        const data = {
            undo: this.undoStack.toArray(),
            redo: this.redoStack.toArray(),
            timestamp: Date.now()
        };
        try {
            localStorage.setItem('zypher_history', JSON.stringify(data));
        } catch (e) {
            console.warn("Storage full or error", e);
        }
    }

    loadFromStorage() {
        try {
            const raw = localStorage.getItem('zypher_history');
            if (raw) {
                const data = JSON.parse(raw);
                // Reconstruct Stacks
                this.undoStack.items = data.undo || [];
                this.redoStack.items = data.redo || [];
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }

    markSnapshot() {
        if (this.undoStack.isEmpty()) return;
        const top = this.undoStack.pop();

        if (top.isSnapshot) {
            // Toggle OFF
            top.isSnapshot = false;
            top.desc = top.desc.replace(/★\s*/g, '').trim();
        } else {
            // Toggle ON
            top.isSnapshot = true;
            top.desc = `★ ${top.desc}`;
        }

        this.undoStack.push(top);
        this.saveToStorage();
    }

    pushAction(textParams, shouldMerge = false) {
        const { prevText, currentText } = textParams;
        const diff = computeDiff(prevText, currentText);

        const action = {
            ...textParams,
            type: diff.type,
            desc: diff.desc,
            isSnapshot: false
        };

        if (shouldMerge && !this.undoStack.isEmpty()) {
            const top = this.undoStack.peek();
            // Don't merge if top is a snapshot!
            if (top.type === action.type && !top.isSnapshot) {
                const mergedDesc = diff.type === 'TYPING'
                    ? `Typed "${action.currentText.slice(top.prevText.length)}"`
                    : action.desc;

                this.undoStack.pop();
                this.undoStack.push({
                    ...top,
                    currentText: action.currentText,
                    desc: mergedDesc
                });
            } else {
                this.undoStack.push(action);
            }
        } else {
            this.undoStack.push(action);
        }
        this.redoStack.clear();
        this.saveToStorage();
    }

    undo() {
        if (this.undoStack.isEmpty()) return null;
        const action = this.undoStack.pop();
        this.redoStack.push(action);
        this.saveToStorage();
        return action;
    }

    redo() {
        if (this.redoStack.isEmpty()) return null;
        const action = this.redoStack.pop();
        this.undoStack.push(action);
        this.saveToStorage();
        return action;
    }

    jumpToUndo(index) {
        const popCount = this.undoStack.size() - 1 - index;
        let lastAction = null;
        for (let i = 0; i < popCount; i++) {
            lastAction = this.undo();
        }
        return lastAction ? lastAction.prevText : null;
    }

    jumpToRedo(index) {
        let lastAction = null;
        for (let i = 0; i <= index; i++) {
            lastAction = this.redo();
        }
        return lastAction ? lastAction.currentText : null;
    }

    getSnapshot() {
        return {
            undoStack: this.undoStack.toArray(),
            redoStack: this.redoStack.toArray()
        };
    }

    clear() {
        this.undoStack.clear();
        this.redoStack.clear();
        this.saveToStorage();
    }
}
