import { Button } from "./lib/components/base/buttons/button-v2";
import { Label } from "./lib/components/base/labels/label_v2";
function App() {
  return (
    <div>
      <Label
        label="Main Label"
        secondary_label="Secondary Label"
        required_label="Required"
        directions='horizontal'
        size="M"

      >
      </Label>
      <Button variant={"PrimeStyle"}>HELLO</Button>
    </div>
  );
}

export default App;
