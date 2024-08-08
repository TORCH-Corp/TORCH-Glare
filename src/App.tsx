import { RadioCard, RadioLabel } from "@/index";
import { useState } from "react";

function App() {

  const [is_selected, setIsSelected] = useState(false);
  return (
    <section>
      <RadioCard onClick={() => setIsSelected(!is_selected)} is_selected={is_selected} label={"Card Label"} description_child={"Card Description"} />
    </section>
  );
}

export default App;
