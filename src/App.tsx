
import { InputField } from "@/components/base/fields/inputField_v2";
import { LabelLessInput } from "@/components/base/fields/labelLessInput_v2";
function App() {
  return (

    <div className="flex flex-col gap-2">
      <LabelLessInput
        required
        placeholder="Hint"
        icon={<i className="ri-lock-fill"></i>}

      />

      <InputField
        placeholder="Hint"
        icon={<i className="ri-lock-fill"></i>}
      />
    </div>
  )
}
export default App; 
