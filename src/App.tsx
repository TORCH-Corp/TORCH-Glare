import { Datepicker } from "@/components/base/DatePicker";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";

function App() {

  const { updateTheme } = useTheme()
  useEffect(() => {
    updateTheme("dark")
  }, [])
  return (
    <div>
      <Datepicker />
    </div>
  );
}
export default App;
