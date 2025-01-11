import { Button } from "@/components/base/buttons/button-v2";
function App() {
  return (
    <div>
      <Button is_loading={true} size='M' variant='YelSecStyle' >save</Button>
    </div>

  );
}

export default App;


{/* <FieldSection
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
  <input type="text" }/>
</FieldSection>

 */}