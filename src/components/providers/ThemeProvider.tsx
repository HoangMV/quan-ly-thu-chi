'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Color = string;
type Font = 'font-inter' | 'font-roboto' | 'font-outfit' | 'font-geist';

interface ThemeContextType {
    theme: Theme;
    primaryColor: Color;
    font: Font;
    setTheme: (theme: Theme) => void;
    setPrimaryColor: (color: Color) => void;
    setFont: (font: Font) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [primaryColor, setPrimaryColor] = useState<Color>('#4f46e5');
    const [font, setFont] = useState<Font>('font-inter');

    // Load from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const savedColor = localStorage.getItem('primaryColor');
        const savedFont = localStorage.getItem('font') as Font;

        if (savedTheme) setTheme(savedTheme);
        if (savedColor) setPrimaryColor(savedColor);
        if (savedFont) setFont(savedFont);
    }, []);

    // Handle theme changes
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    // Handle primary color changes
    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty('--primary', primaryColor);
        localStorage.setItem('primaryColor', primaryColor);
    }, [primaryColor]);

    // Handle font changes
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('font-inter', 'font-roboto', 'font-outfit', 'font-geist');
        root.classList.add(font);
        localStorage.setItem('font', font);
    }, [font]);

    return (
        <ThemeContext.Provider value={{ theme, primaryColor, font, setTheme, setPrimaryColor, setFont }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
