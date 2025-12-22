import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Toolbar from './Toolbar';
import StackVisualizer from './StackVisualizer';
import CodeTextArea from './CodeTextArea';

const LANGUAGES = {
    'javascript': { name: 'JavaScript', ext: 'js', template: "// Start coding here...\nfunction hello() {\n  return 'world';\n}" },
    'python': { name: 'Python', ext: 'py', template: "# Start coding here...\ndef hello():\n    return 'world'" },
    'cpp': { name: 'C++', ext: 'cpp', template: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello World\";\n    return 0;\n}" },
    'java': { name: 'Java', ext: 'java', template: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}" },
    'c': { name: 'C', ext: 'c', template: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}" },
    'text': { name: 'Text', ext: 'txt', template: "Write your notes here..." }
};

const Editor = ({ historyManager, onHistoryUpdate }) => {
    const [language, setLanguage] = useState('javascript');
    const [text, setText] = useState(LANGUAGES['javascript'].template);
    const [filename, setFilename] = useState("main.js");
    const [lintStatus, setLintStatus] = useState({ error: 0, warning: 0, text: 'Ready' });

    const lastTypeTime = useRef(0);
    const COALESCE_THRESHOLD_MS = 1000;

    const handleInput = (e) => {
        const newText = e.target.value;
        const now = Date.now();
        const shouldMerge = (now - lastTypeTime.current) < COALESCE_THRESHOLD_MS;

        const action = {
            prevText: text,
            currentText: newText,
            timestamp: new Date().toLocaleTimeString()
        };

        historyManager.pushAction(action, shouldMerge);

        lastTypeTime.current = now;
        setText(newText);
        onHistoryUpdate();

        updateLintStatus(newText);
    };

    const updateLintStatus = (code) => {
        setLintStatus({ error: 0, warning: 0, text: 'Linting...' });

        setTimeout(() => {
            const errors = (code.match(/error/gi) || []).length;
            const warnings = (code.match(/todo/gi) || []).length;

            setLintStatus({
                error: errors,
                warning: warnings,
                text: errors > 0 ? 'Failed' : 'Ready'
            });
        }, 600);
    };

    const handleUndo = () => {
        const action = historyManager.undo();
        if (action) {
            setText(action.prevText);
            onHistoryUpdate();
            updateLintStatus(action.prevText);
        }
    };

    const handleRedo = () => {
        const action = historyManager.redo();
        if (action) {
            setText(action.currentText);
            onHistoryUpdate();
            updateLintStatus(action.currentText);
        }
    };

    const handleJump = (stackType, index) => {
        let resultText = null;
        if (stackType === 'undo') {
            resultText = historyManager.jumpToUndo(index);
        } else {
            resultText = historyManager.jumpToRedo(index);
        }

        if (resultText !== null) {
            setText(resultText);
            onHistoryUpdate();
            updateLintStatus(resultText);
        }
    };

    const handleSave = () => {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSnapshot = () => {
        historyManager.markSnapshot();
        onHistoryUpdate();
    };

    const handleReplay = () => {
        const { undoStack } = historyManager.getSnapshot();
        let i = 0;
        const speed = 800;

        const interval = setInterval(() => {
            if (i >= undoStack.length) {
                clearInterval(interval);
                return;
            }
            const action = undoStack[i];
            setText(action.currentText);
            updateLintStatus(action.currentText);
            i++;
        }, speed);
    };

    const changeLanguage = (langKey) => {
        const lang = LANGUAGES[langKey];
        setLanguage(langKey);
        const nameParts = filename.split('.');
        const baseName = nameParts[0] || 'script';
        setFilename(`${baseName}.${lang.ext}`);

        setText(lang.template);

        historyManager.pushAction({
            prevText: text,
            currentText: lang.template,
            timestamp: new Date().toLocaleTimeString()
        });
        onHistoryUpdate();
        updateLintStatus(lang.template);
    };

    const { undoStack, redoStack } = historyManager.getSnapshot();

    const handleClear = () => {
        historyManager.clear();
        setText(LANGUAGES[language].template);
        onHistoryUpdate();
        setLintStatus({ error: 0, warning: 0, text: 'Ready' });
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* Main Editor Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{
                    padding: '12px 24px',
                    borderBottom: '1px solid var(--c-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--c-bg-glass)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Filename Input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: 'var(--c-primary)'
                            }} />
                            <input
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                style={{
                                    fontWeight: 600, fontSize: '14px', color: 'var(--c-text-main)',
                                    background: 'transparent', border: 'none', outline: 'none',
                                    fontFamily: 'inherit', width: '140px'
                                }}
                            />
                        </div>

                        {/* Language Selector */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <select
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                                style={{
                                    appearance: 'none',
                                    background: 'var(--c-bg-panel)',
                                    border: '1px solid var(--c-border)',
                                    borderRadius: '6px',
                                    padding: '6px 32px 6px 12px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: 'var(--c-text-main)',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    minWidth: '110px'
                                }}
                            >
                                {Object.entries(LANGUAGES).map(([key, data]) => (
                                    <option key={key} value={key}>{data.name}</option>
                                ))}
                            </select>
                            <div style={{
                                position: 'absolute',
                                right: '8px',
                                pointerEvents: 'none',
                                color: 'var(--c-text-muted)',
                                display: 'flex'
                            }}>
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {text.length} chars
                    </div>
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <CodeTextArea
                        value={text}
                        onChange={handleInput}
                        placeholder="Type code..."
                    />
                </div>

                {/* Status Bar (Professional Dark) */}
                <div style={{
                    height: '28px',
                    background: 'var(--c-status-bg)',
                    display: 'flex', alignItems: 'center', padding: '0 16px',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: 'var(--c-status-text)',
                    fontFamily: 'var(--font-sans)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    letterSpacing: '0.3px'
                }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Zypher // Fold</span>
                        <span>{lintStatus.error} Errors</span>
                        <span>{lintStatus.warning} Warnings</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', opacity: 0.9 }}>
                        <span>Ln {text.split('\n').length}, Col 1</span>
                        <span>UTF-8</span>
                        <span>{LANGUAGES[language].name}</span>
                        <span style={{
                            color: lintStatus.text === 'Ready' ? '#69F0AE' : '#FF5252',
                            fontWeight: 600
                        }}>
                            {lintStatus.text === 'Ready' ? '● READY' : '● FAILED'}
                        </span>
                    </div>
                </div>

                <Toolbar
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onSave={handleSave}
                    onSnapshot={handleSnapshot}
                    onReplay={handleReplay}
                    canUndo={undoStack.length > 0}
                    canRedo={redoStack.length > 0}
                />
            </div>

            {/* Visualizer Sidebar */}
            <StackVisualizer historyManager={historyManager} onJump={handleJump} onClear={handleClear} />
        </div>
    );
};

export default Editor;
