import { SlideDatePicker } from "@/components/base/SlideDatePicker";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";

function App() {

  const { updateTheme } = useTheme()
  useEffect(() => {
    updateTheme("dark")
  }, [])
  return (
    <div>
      <SlideDatePicker variant="PresentationStyle" />
    </div>
  );
}
export default App;
