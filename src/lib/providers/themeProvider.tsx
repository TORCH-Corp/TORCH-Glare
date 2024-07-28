"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeProps {
    theme: string;
    updateTheme: (theme: "light" | "dark" | "default") => void;
}

export const ThemeContext = createContext<ThemeProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [theme, setTheme] = useState<"light" | "dark" | "default">(() => {
        // Initialize the theme from local storage or default to "default"
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') as "light" | "dark" | "default" || "default";
        }
        return "default";
    });

    useEffect(() => {
        // Apply the theme to the document element
        document.documentElement.setAttribute('data-theme', theme);
        // Save the theme to local storage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const updateTheme = (newTheme: "light" | "dark" | "default") => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = {
        theme,
        updateTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
