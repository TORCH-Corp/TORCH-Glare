import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeProps {
    theme: "light" | "dark" | "default";
    themeMode: "CSS" | "TORCH";
    updateTheme: (theme: "light" | "dark" | "default") => void;
    updateMode: (themeMode: "CSS" | "TORCH") => void;
}

export const ThemeContext = createContext<ThemeProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [theme, setTheme] = useState<"light" | "dark" | "default">(() => {
        const mode = document.documentElement.getAttribute('data-theme') as "light" | "dark" | "default" || "default";
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme') as "light" | "dark" | "default";
            return storedTheme || mode || "default";
        }
        return "default";
    });

    const [themeMode, setThemeMode] = useState<"TORCH" | "CSS">(() => {
        if (typeof window !== 'undefined') {
            const storedThemeMode = localStorage.getItem('theme-mode') as "TORCH" | "CSS";
            return storedThemeMode || "TORCH";
        }
        return "TORCH";
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-theme-mode', themeMode);
        localStorage.setItem('theme', theme);
        localStorage.setItem('theme-mode', themeMode);
    }, [theme, themeMode]);

    const updateTheme = (newTheme: "light" | "dark" | "default") => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const updateMode = (newThemeMode: "CSS" | "TORCH") => {
        setThemeMode(newThemeMode);
        document.documentElement.setAttribute('data-theme-mode', newThemeMode);
        localStorage.setItem('theme-mode', newThemeMode);
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
