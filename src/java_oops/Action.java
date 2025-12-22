package java_oops;

/**
 * Abstract Base Class representing a generic Action.
 * demonstratest ABSTRACTION and ENCAPSULATION.
 */
public abstract class Action {
    private long timestamp;
    private String description;

    public Action(String description) {
        this.timestamp = System.currentTimeMillis();
        this.description = description;
    }

    // Encapsulation: Private fields accessed via Getters
    public long getTimestamp() {
        return timestamp;
    }

    public String getDescription() {
        return description;
    }

    // Abstract method forcing Polymorphism
    public abstract void execute();
    public abstract void undo();
}
