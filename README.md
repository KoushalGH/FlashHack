# Zypher Fold (Ultimate Edition) 🌌

**Zypher Fold** is a cutting-edge IDE designed to demonstrate mastery of Data Structures (Stacks) and Object-Oriented Programming (OOP). It features a **Dual-Stack History Engine** and a modular **Polyglot Architecture**.

## 🚀 Key Features

### 1. Dual-Stack Visualizer (DSA) 📚
*   **True Undo/Redo Implementation**: We use two separate stacks (`undoStack` & `redoStack`) to manage state.
*   **Visual Proof**: The sidebar explicitly shows two vertical columns.
    *   **Left Column (Undo)**: History of actions taken.
    *   **Right Column (Redo)**: Future actions that can be restored.
*   **O(1) Operations**: Immediate push/pop operations for high performance.

### 2. Java OOP Engine (`src/java_oops/`) ☕
A production-grade Java implementation demonstrating core OOP principles:
*   **Encapsulation**: strictly private fields with getters/setters in `Action.java`.
*   **Inheritance**: `TypingAction` extends the abstract base `Action`.
*   **Polymorphism**: `undo()` and `execute()` methods are polymorphic.
*   **Abstraction**: Logic is defined via the `IStack` interface.

### 3. Polyglot Support 🌐
*   **Languages**: JavaScript, Python, Java, C++, C, Text.
*   **Smart Features**: Auto-templating and file extension switching.
*   **Linting**: Integrated Status Bar with real-time "Mock" connectivity state.

## 🛠 Project Structure

*   `src/components/StackVisualizer.jsx`: React component rendering the Dual Stacks.
*   `src/core/logic.js`: The JavaScript Logic Engine.
*   `src/java_oops/`: **Pure Java OOP Implementation** (for code review validation).

## ⚡ Getting Started

1.  **Install**:
    ```bash
    npm install
    ```
2.  **Run**:
    ```bash
    npm run dev
    ```

---
*Built for the Flash Hackathon 2025*
