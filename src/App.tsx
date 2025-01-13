
import { InputField } from "@/components/base/fields/inputField_v2";
function App() {
  return (
    <InputField
      size="S"
      placeholder="Hint"
      icon={<i className="ri-lock-fill"></i>}
      dropDownListChildren={<>
        <button>Item 1 </button>
        <button>Item 2 </button>
        <button>Item 3 </button>
        <button>Item 3 </button>
        <button>Item 3 </button>
        <button>Item 3 </button>
        <button>Item 3 </button>

      </>}
    />
  )
}
export default App;
