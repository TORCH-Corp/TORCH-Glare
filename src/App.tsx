import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";
import { Datepicker } from "@/components/base/DatePicker";
function App() {

  const { updateTheme } = useTheme()
  useEffect(() => {
    updateTheme("dark")
  }, [])


  return (
    <Datepicker />
  );
}
export default App;
