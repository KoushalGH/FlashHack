import React, { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const StackItem = ({ action, isFuture, isLast, onClick }) => {
    const typeColors = {
        'INSERT': '#10B981',
        'DELETE': '#EF4444',
        'TYPING': '#3B82F6',
        'PASTE': '#8B5CF6',
        'EDIT': '#F59E0B'
    };

    const typeColor = typeColors[action.type] || '#6B7280';
    const isSnapshot = action.isSnapshot;
    const borderColor = isSnapshot ? '#FFD700' : (isLast ? `var(--c-primary)` : 'var(--c-border)');

    return (
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
            <div style={{ position: 'absolute', left: '11px', top: '-6px', bottom: '-6px', width: '2px', background: 'var(--c-border)', zIndex: 0 }} />

            <div style={{ position: 'absolute', left: '7px', top: '18px', width: '10px', height: '10px', borderRadius: '50%', background: isSnapshot ? '#FFD700' : (isLast ? 'var(--c-primary)' : 'var(--c-border)'), zIndex: 1, border: '2px solid var(--c-bg-panel)' }} />

            <div
                onClick={onClick}
                className="stack-item"
                style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'var(--c-bg-panel)',
                    border: `1px solid ${borderColor}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSnapshot ? '0 0 8px rgba(255, 215, 0, 0.4)' : 'none',
                    zIndex: 2, position: 'relative'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: isSnapshot ? '#FFD700' : typeColor, fontSize: '12px' }}>
                        {isSnapshot ? '★ ' : ''}{action.type}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {action.timestamp}
                    </span>
                </div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--c-text-muted)', lineHeight: '1.4' }}>
                    {action.desc}
                </div>
            </div>
        </div>
    );
};

const StackVisualizer = ({ historyManager, onJump, onClear }) => {
    const undoRef = useRef(null);
    const redoRef = useRef(null);

    const { undoStack, redoStack } = historyManager.getSnapshot();

    useEffect(() => {
        if (undoRef.current) {
            undoRef.current.scrollTop = undoRef.current.scrollHeight;
        }
    }, [undoStack.length]);

    return (
        <div style={{
            width: '320px',
            background: 'var(--c-bg-panel)',
            borderLeft: '1px solid var(--c-border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--c-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--c-bg-glass)'
            }}>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--c-text-main)' }}>
                        MEMORY STACKS
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', marginTop: '2px' }}>
                        Undo/Redo Architecture
                    </div>
                </div>
                <button
                    onClick={onClear}
                    style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid var(--c-border)',
                        borderRadius: '6px',
                        color: 'var(--c-primary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--c-primary)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--c-primary)';
                    }}
                >
                    <Trash2 size={12} /> CLEAR
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--c-border)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--c-text-muted)',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        background: 'var(--c-bg-glass)'
                    }}>
                        ← UNDO (PAST)
                    </div>
                    <div ref={undoRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {undoStack.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--c-text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                                No history yet
                            </div>
                        ) : (
                            [...undoStack].reverse().map((action, i) => {
                                const realIndex = undoStack.length - 1 - i;
                                return (
                                    <StackItem
                                        key={`undo-${realIndex}`}
                                        action={action}
                                        isFuture={false}
                                        isLast={realIndex === undoStack.length - 1}
                                        onClick={() => onJump('undo', realIndex)}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, borderTop: '2px solid var(--c-border)' }}>
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--c-border)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--c-text-muted)',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        background: 'var(--c-bg-glass)'
                    }}>
                        REDO (FUTURE) →
                    </div>
                    <div ref={redoRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {redoStack.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--c-text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                                No future states
                            </div>
                        ) : (
                            [...redoStack].reverse().map((action, i) => {
                                const realIndex = redoStack.length - 1 - i;
                                return (
                                    <StackItem
                                        key={`redo-${realIndex}`}
                                        action={action}
                                        isFuture={true}
                                        isLast={realIndex === redoStack.length - 1}
                                        onClick={() => onJump('redo', realIndex)}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StackVisualizer;
