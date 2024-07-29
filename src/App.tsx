import { Button, InputField, useTheme } from "./lib"

function App() {

  const { updateTheme, theme } = useTheme()

  return (
    <div style={{ maxWidth: "400px", display: 'flex', flexDirection: 'column', margin: "30px 0", gap: "10px" }}>
      <Button onClick={() => updateTheme(theme === "light" ? "dark" : "light")}>Pr</Button>
      <InputField name={""} />
    </div>
  )
}
export default App


