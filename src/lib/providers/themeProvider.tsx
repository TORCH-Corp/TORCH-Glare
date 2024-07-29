import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeProps {
    theme: string;
    themeMode: string
    updateTheme: (theme: "light" | "dark" | "default") => void;
    updateMode: (theme: "CSS" | "TORCH") => void;
}

export const ThemeContext = createContext<ThemeProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [theme, setTheme] = useState<"light" | "dark" | "default">(() => {
        // Initialize the theme from local storage or default to "default"
        const mode = document.documentElement.getAttribute('data-theme') as "light" | "dark" | "default" || "default";
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('theme') !== null) return localStorage.getItem('theme') as "light" | "dark" | "default" || "default";
            else if (mode) return mode
            return "default";
        }
        return "default";
    });

    const [themeMode, setThemeMode] = useState<"TORCH" | "CSS">(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('theme-mode') !== null) return localStorage.getItem('theme-mode') as "TORCH" | "CSS" || "TORCH";
            else return "TORCH";
        }
        return "TORCH";
    });

    useEffect(() => {
        // Apply the theme to the document element
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-theme-mode', themeMode);
        // Save the theme to local storage
        localStorage.setItem('theme', theme);
        localStorage.setItem('theme-mode', themeMode);
    }, [theme, themeMode]);

    const updateTheme = (newTheme: "light" | "dark" | "default") => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme-mode', newTheme);
    };

    const updateMode = (newTheme: "CSS" | "TORCH") => {
        setThemeMode(newTheme);
        document.documentElement.setAttribute('data-theme-mode', newTheme);
        localStorage.setItem('theme-mode', newTheme);
    };

    const value = {
        theme,
        updateTheme,
        updateMode,
        themeMode
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
