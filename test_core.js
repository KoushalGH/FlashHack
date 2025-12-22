import HistoryManager from './src/core/HistoryManager.js';

// Mock simple assertions
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exit(1);
    }
    console.log(`✅ PASSED: ${message}`);
}

console.log("--- Testing Core Logic (Person A) ---");

// Test Stack Logic via HistoryManager
const manager = new HistoryManager();

// 1. Initial State
const initial = manager.getSnapshot();
assert(initial.undoStack.length === 0, "Undo stack starts empty");
assert(initial.redoStack.length === 0, "Redo stack starts empty");

// 2. Push Action
manager.pushAction({ type: 'TYPING', text: 'Hello' });
const s1 = manager.getSnapshot();
assert(s1.undoStack.length === 1, "Undo stack has 1 item after push");
assert(s1.redoStack.length === 0, "Redo stack empty after push");

// 3. Undo
const undoAction = manager.undo();
const s2 = manager.getSnapshot();
assert(undoAction.text === 'Hello', "Undo returned correct action");
assert(s2.undoStack.length === 0, "Undo stack empty after undo");
assert(s2.redoStack.length === 1, "Redo stack has 1 item after undo");

// 4. Redo
const redoAction = manager.redo();
const s3 = manager.getSnapshot();
assert(redoAction.text === 'Hello', "Redo returned correct action");
assert(s3.undoStack.length === 1, "Undo stack restored");
assert(s3.redoStack.length === 0, "Redo stack empty after redo");

console.log("--- All Core Logic Tests Passed ---");
