import React, { useRef, useEffect } from 'react';

const CodeTextArea = ({ value, onChange, placeholder }) => {
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    // Sync scroll
    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const lineCount = value.split('\n').length;
    const lines = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

    return (
        <div style={{
            display: 'flex',
            height: '100%',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            lineHeight: '1.6',
            position: 'relative'
        }}>
            {/* Line Numbers Gutter */}
            <div
                ref={lineNumbersRef}
                style={{
                    width: '40px',
                    background: 'var(--c-bg-app)',
                    borderRight: '1px solid var(--c-border)',
                    color: 'var(--c-text-muted)',
                    textAlign: 'right',
                    padding: '30px 8px 30px 0',
                    userSelect: 'none',
                    overflow: 'hidden',
                    lineHeight: '1.6' // Match textarea
                }}
            >
                {lines.map(n => (
                    <div key={n} style={{ height: '1.6em' }}>{n}</div>
                ))}
            </div>

            {/* Actual Texture */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onScroll={handleScroll}
                placeholder={placeholder}
                spellCheck="false"
                style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    background: 'transparent',
                    padding: '30px', // Matches gutter padding
                    color: 'var(--c-text-main)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre'
                }}
            />
        </div>
    );
};

export default CodeTextArea;
