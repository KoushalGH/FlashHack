package java_oops;

/**
 * Main Application Entry Point.
 * Simulates usage of the OOP components.
 */
public class ZypherEditor {
    public static void main(String[] args) {
        System.out.println("Initializing Zypher Fold Engine (Java Backend)...");
        
        HistoryManager history = new HistoryManager();

        // User typed "Hello"
        Action a1 = new TypingAction("Hello");
        history.addAction(a1);

        // User typed " World"
        Action a2 = new TypingAction(" World");
        history.addAction(a2);

        // Undo last action
        System.out.println("\n--- Performing Undo ---");
        history.undo();

        // Redo action
        System.out.println("\n--- Performing Redo ---");
        history.redo();
        
        System.out.println("\nOOP Demonstration Complete.");
    }
}
