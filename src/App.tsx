
import { InputField } from "@/components/base/fields/inputField_v2";
function App() {
  return (
    <InputField
      size="S"
      placeholder="Hint"
      icon={<i className="ri-lock-fill"></i>}
      dropDownListChildren={<>
        <div>Item 1 </div>
        <div>Item 2 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
        <div>Item 3 </div>
      </>}
    />
  )
}
export default App;
