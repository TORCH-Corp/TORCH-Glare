import { InputField } from '../dist'
import '../dist/themes/index.css'

function App() {
  return (
    <div style={{ maxWidth: "400px", display: 'flex', flexDirection: 'column', margin: "30px 0", gap: "10px" }}>
      <InputField label='Test' name={''} />
    </div>
  )
}
export default App


