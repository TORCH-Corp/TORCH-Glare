import { Button, InputField, useTheme } from '../dist'

function App() {

  const { updateTheme, theme, themeMode, updateMode } = useTheme()

  return (
    <div style={{ maxWidth: "400px", display: 'flex', flexDirection: 'column', margin: "30px 0", gap: "10px" }}>
      <Button onClick={() => updateTheme(theme === "light" ? "dark" : "light")}>Theme</Button>
      <Button onClick={() => updateMode(themeMode === "CSS" ? "TORCH" : "CSS")}>Mode</Button>
      <InputField name={""} />
    </div>
  )
}
export default App


