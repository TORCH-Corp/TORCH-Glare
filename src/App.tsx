import { Button, InputField, useTheme } from "../dist";

function App() {

  const { theme, updateTheme } = useTheme()
  return (

    <div>
      <InputField
        id="email"
        name="email"
        component_size="M"
        label={"login_inputs.user_name"}
        placeholder={"login_inputs.email_placeholder"}
        left_side_icon={<i className="ri-account-circle-fill"></i>}
        className="sign-in-input" />

      <Button onClick={() => updateTheme(theme == "dark" ? "light" : "dark")}>
        {`Change From ${theme}`}
      </Button>
    </div>
  );
}

export default App;
