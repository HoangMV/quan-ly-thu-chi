'use client';

import { useState, createContext, useContext, useEffect } from 'react';

interface SidebarContextType {
    isOpen: boolean;           // For mobile drawer
    isCollapsed: boolean;      // For desktop mini sidebar
    toggle: () => void;
    toggleCollapse: () => void;
    close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Initial load
    useEffect(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved === 'true') setIsCollapsed(true);
    }, []);

    const toggle = () => setIsOpen(prev => !prev);
    const toggleCollapse = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        localStorage.setItem('sidebar-collapsed', String(next));
    };
    const close = () => setIsOpen(false);

    return (
        <SidebarContext.Provider value={{ isOpen, isCollapsed, toggle, toggleCollapse, close }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) throw new Error('useSidebar must be used within SidebarProvider');
    return context;
}
