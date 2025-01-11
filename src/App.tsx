import { FieldSection } from "@/components/shared/forms/fieldSection_v2";
import { Alert } from "./lib";
function App() {
  return (
    <FieldSection
      label="Label"
      requiredLabel="*"
      secondaryLabel="Secondary label"
      size="M"
      childrenUnderLabel={<>
        <Alert
          component_label="dsdsdds"
          component_state="Success"
        />
        <Alert
          component_label="dsdsdds"
          component_state="Error"
        />
      </>}
    >
      <div className="flex flex-col gap-[12px] flex-1">
        <input type="text" className="flex-1" />
        <input type="text" className="flex-1" />
        <input type="text" className="flex-1" />
        <input type="text" className="flex-1" />
        <input type="text" className="flex-1" />
      </div>
    </FieldSection>
  )
}
export default App;

