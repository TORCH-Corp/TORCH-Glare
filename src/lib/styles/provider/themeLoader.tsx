import { useEffect } from 'react';
interface Props {
    theme: "dark" | "default";
}

export function ThemeLoader(props: Props) {

    useEffect(() => {
        // Remove the existing theme link if it exists
        const existingLink = document.getElementById('theme-style');
        if (existingLink) {
            existingLink.parentNode?.removeChild(existingLink);
        }

        // Dynamically import the CSS file
        const loadTheme = async () => {
            switch (props.theme) {
                case 'dark':
                    await import('torch-glare/dist/themes/colorMapping/dark.css');
                    break;
                default:
                    await import('torch-glare/dist/themes/colorMapping/default.css');
            }
        };

        loadTheme();

        // Clean up the link element when the component is unmounted or theme changes
        return () => {
            const existingLink = document.getElementById('theme-style');
            if (existingLink) {
                existingLink.parentNode?.removeChild(existingLink);
            }
        };
    }, [props.theme]);

    return null;
};



