import { useState } from "react";
import { Switcher } from "./lib/components/base/switchers/switcher";

function App() {

  const [isActive, setIsActive] = useState(false)

  return (
    <Switcher active_label="Active" disabled_label="Disabled" onClick={() => setIsActive(!isActive)} active={isActive} />
  );
}

export default App;
