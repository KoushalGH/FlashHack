import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const Layout = ({ children }) => {
    const [theme, setTheme] = useState('light');

    // Sync theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            maxWidth: '100vw',
            padding: '20px',
            gap: '20px',
            position: 'relative'
        }}>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                style={{
                    position: 'absolute',
                    bottom: '32px',
                    left: '32px',
                    zIndex: 50,
                    background: 'var(--c-bg-panel)',
                    border: '1px solid var(--c-border)',
                    borderRadius: '50%',
                    width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--c-text-main)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s'
                }}
                title="Toggle Theme"
            >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Glass Shell Container */}
            <div className="glass-panel" style={{
                flex: 1,
                display: 'flex',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'background 0.3s ease, border 0.3s ease'
            }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
