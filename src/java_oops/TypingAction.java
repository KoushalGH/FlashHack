package java_oops;

/**
 * Concrete implementation of Action.
 * Demonstrates INHERITANCE and POLYMORPHISM.
 */
public class TypingAction extends Action {
    private String text;

    public TypingAction(String text) {
        super("Typed: " + text); // Super keyword (Inheritance)
        this.text = text;
    }

    @Override
    public void execute() {
        System.out.println("Processing Input: " + text);
    }

    @Override
    public void undo() {
        System.out.println("Removing Text: " + text);
    }
}
