import { Label } from "./lib/components/base/labels/label_v2";
function App() {
  return (
    <div>
      <Label
        label="Main Label"
        secondary_label="Secondary Label"
        required_label="Required"
        component_style="vertical"
        component_size="M"
      >
      </Label>
    </div>
  );
}

export default App;
