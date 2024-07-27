import { InputField, ThemeLoader } from './lib'

function App() {

  ThemeLoader({ theme: 'default' })
  return (
    <div style={{ maxWidth: "400px", display: 'flex', flexDirection: 'column', margin: "30px 0", gap: "10px" }}>
      <InputField label='Test' name={''} />
    </div>
  )
}
export default App


