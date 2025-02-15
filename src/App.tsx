import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";
import Examples from "./exmples";

function App() {

  const { updateTheme } = useTheme()
  useEffect(() => {
    updateTheme("dark")
  }, [])

  return (
    <Examples />
  );
}
export default App;


// using with react hook form lib
/*
        <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="dateOfBirth"
        control={control}
        render={() => (
          <Datepicker
            customInput={<InputField variant="SystemStyle" />}
            placeholderText="Select date"
            onChange={(e: any) => {
              setValue("dateOfBirth", e, {
                shouldDirty: true
              });
            }}
          />
        )}
      />
      <button>submit</button>
    </form>
*/