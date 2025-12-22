package java_oops;

import java.util.ArrayList;
import java.util.List;

/**
 * Generic Stack Implementation.
 * Demonstrates GENERICS and ENCAPSULATION.
 */
public class Stack<T> implements IStack<T> {
    private List<T> items; // Composition

    public Stack() {
        this.items = new ArrayList<>();
    }

    @Override
    public void push(T item) {
        items.add(item);
    }

    @Override
    public T pop() {
        if (isEmpty()) return null;
        return items.remove(items.size() - 1);
    }

    @Override
    public T peek() {
        if (isEmpty()) return null;
        return items.get(items.size() - 1);
    }

    @Override
    public boolean isEmpty() {
        return items.isEmpty();
    }

    @Override
    public int size() {
        return items.size();
    }
}
