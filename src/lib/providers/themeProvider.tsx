import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface ThemeProps {
    theme: string;
    updateTheme: (theme: "light" | "dark" | "default") => void
}
export const themeContext = createContext<ThemeProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [theme, setTheme] = useState("default");

    useEffect(() => {
        if (!document.documentElement.getAttribute('data-theme')) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);

    const updateTheme = (theme: "light" | "dark" | "default") => {
        setTheme(theme);
    }

    return (
        <themeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </themeContext.Provider>
    );
};
