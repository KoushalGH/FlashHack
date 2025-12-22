import React from 'react';
import { RotateCcw, RotateCw, Save, Copy, Trash2, Star, Play } from 'lucide-react';

const Toolbar = ({ onUndo, onRedo, onSave, onSnapshot, onReplay, canUndo, canRedo }) => {
    return (
        <div className="glass-panel" style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-pill)',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
            background: 'var(--c-bg-glass)'
        }}>
            <ToolButton onClick={onUndo} icon={<RotateCcw size={18} />} label="Undo" disabled={!canUndo} />
            <ToolButton onClick={onRedo} icon={<RotateCw size={18} />} label="Redo" disabled={!canRedo} />
            <div style={{ width: '1px', background: 'var(--c-border)', margin: '0 4px' }} />
            <ToolButton onClick={onSave} icon={<Save size={18} />} label="Save" />

            <div style={{ width: '1px', background: 'var(--c-border)', margin: '0 4px' }} />

            <ToolButton onClick={onSnapshot} icon={<Star size={18} />} label="Bookmark State" />
            <ToolButton onClick={onReplay} icon={<Play size={18} />} label="Replay History" />
        </div>
    );
};

const ToolButton = ({ onClick, icon, label, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={label}
        style={{
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: disabled ? 'var(--c-text-muted)' : 'var(--c-text-main)',
            opacity: disabled ? 0.4 : 1,
            transition: 'all 0.2s ease',
            cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--c-bg-app)')}
        onMouseLeave={(e) => !disabled && (e.currentTarget.style.background = 'transparent')}
    >
        {icon}
    </button>
);

export default Toolbar;
