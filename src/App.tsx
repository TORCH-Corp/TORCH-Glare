import { InputField, ThemeProvider } from "./lib";

function App() {
  return (
    <ThemeProvider>
      <InputField
        id="email"
        name="email"
        component_size="M"
        label={"login_inputs.user_name"}
        placeholder={"login_inputs.email_placeholder"}
        left_side_icon={<i className="ri-account-circle-fill"></i>}
        theme="System-Style"
        className="sign-in-input"
      />
    </ThemeProvider>
  );
}

export default App;
