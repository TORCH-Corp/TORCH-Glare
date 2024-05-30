import { InputField } from "../dist"

function App() {

  return (
    <section className='app' >
      <InputField className="test" label="Label" name={""} theme='System-Style' component_size='L' error_message="Email is Required" />
    </section >
  )
}
export default App

