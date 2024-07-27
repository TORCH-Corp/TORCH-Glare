import React, { createContext, ReactNode, useEffect, useState } from 'react';

export const themeContext = createContext<any>(undefined);

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
