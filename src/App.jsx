import { useState } from 'react'
import Layout from './components/Layout'
import Editor from './components/Editor'
import HistoryManager from './core/logic'

function App() {
    // Initialize the core logic here (Person A's work integrated)
    // We use state to force re-renders when history changes, 
    // though typically we might use a robust state manager. 
    // For this simple hackathon, we'll pass the manager down and force updates.
    const [historyManager] = useState(() => new HistoryManager());
    const [content, setContent] = useState("");
    const [historySnapshot, setHistorySnapshot] = useState({ undoStack: [], redoStack: [] });

    const handleEditorChange = (newContent) => {
        // Determine the diff (simple approach: full string snapshot for now, 
        // but the problem asks for "edits, additions". 
        // We will let the Editor component handle granular operations or diffing.)
        // For the skeleton, we just update state.
        setContent(newContent);
    };

    return (
        <Layout>
            <Editor
                content={content}
                onContentChange={handleEditorChange}
                historyManager={historyManager}
                onHistoryUpdate={() => setHistorySnapshot(historyManager.getSnapshot())}
            />
        </Layout>
    )
}

export default App
