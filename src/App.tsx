import { Button } from "@/components/base/button";
import { RadioCard } from "@/components/base/radioCard";
import "@/styles/globals.css";
import { useEffect, useRef } from "react";

function App() {
  const ref = useRef<any>(null);

  useEffect(() => {
    console.log(ref.current);
  }, [ref.current]);

  return (
    <div className="flex flex-col gap-2 flex-1">
      <RadioCard
        id="test"
        headerLabel="This is a test"
        description="This is a description"
      ></RadioCard>
    </div>
  );
}
export default App;
