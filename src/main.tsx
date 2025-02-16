import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider defaultTheme="dark" defaultThemeMode="TORCH">
    <App />
  </ThemeProvider>
);
