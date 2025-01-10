import { FieldSection } from "@/components/shared/forms/fieldSection_v2";
function App() {
  return (
    <div>
      <FieldSection
        label="Label"
        requiredLabel="*"
        secondaryLabel="Secondary label"
        size="M"
        childrenUnderLabel={<div>
          <p>Children under label</p>
          <p>Children under label</p>
          <p>Children under label</p>
        </div>}
      >
        <input type="text" />
        <input type="text" />
        <input type="text" />
      </FieldSection>
    </div>
  );
}

export default App;
