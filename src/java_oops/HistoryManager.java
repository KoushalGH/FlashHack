package java_oops;

/**
 * Manages the History using two Stacks.
 * Demonstrates COMPOSITION and ALGORITHMIC LOGIC.
 */
public class HistoryManager {
    // Composition: Using IStack interface type for flexibility
    private IStack<Action> undoStack;
    private IStack<Action> redoStack;

    public HistoryManager() {
        this.undoStack = new Stack<>();
        this.redoStack = new Stack<>();
    }

    public void addAction(Action action) {
        undoStack.push(action);
        redoStack = new Stack<>(); // Clear redo on new action
        action.execute();
    }

    public void undo() {
        if (undoStack.isEmpty()) {
            System.out.println("Nothing to undo.");
            return;
        }
        Action action = undoStack.pop();
        action.undo(); // Polymorphic call
        redoStack.push(action);
    }

    public void redo() {
        if (redoStack.isEmpty()) {
            System.out.println("Nothing to redo.");
            return;
        }
        Action action = redoStack.pop();
        action.execute(); // Polymorphic call
        undoStack.push(action);
    }
}
