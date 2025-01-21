import { Textarea } from "@/components/base/fields/noteInputField";
import "@/styles/globals.css";
import { useEffect, useRef } from "react";

function App() {
  const ref = useRef<any>(null);

  useEffect(() => {
    console.log(ref.current);
  }, [ref.current]);

  return (
    <div className="flex flex-col gap-2 flex-1">
      <Textarea placeholder="placeholder" label="label" />
    </div>
  );
}
export default App;
