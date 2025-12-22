package java_oops;

/**
 * Interface defining the contract for a Stack.
 * Demonstrates ABSTRACTION.
 */
public interface IStack<T> {
    void push(T item);
    T pop();
    T peek();
    boolean isEmpty();
    int size();
}
