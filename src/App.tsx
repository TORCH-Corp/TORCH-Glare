
import { InputField } from "@/components/base/fields/inputField_v2";
import { LabelLessInput } from "@/components/base/fields/labelLessInput_v2";
function App() {
  return (

    <div className="flex flex-col gap-2">
      <LabelLessInput
        required
        placeholder="Hint"
        icon={<i className="ri-lock-fill"></i>}

        dropDownListChildren={<>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
        </>}

      />

      <InputField
        variant="systemStyle"
        placeholder="Hint"
        icon={<i className="ri-lock-fill"></i>}
        dropDownListChildren={<>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
        </>}
      />
    </div>
  )
}
export default App; 
