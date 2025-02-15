import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";
import { Controller, useForm } from 'react-hook-form'
import { Datepicker } from "@/components/base/DatePicker";
import { InputField } from "@/components/base/InputField";

function App() {

  const { updateTheme } = useTheme()
  useEffect(() => {
    updateTheme("dark")
  }, [])

  const { control, setValue, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="dateOfBirth"
        control={control}
        render={() => (
          <Datepicker
            customInput={<InputField />}
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
  );
}
export default App;


// using with react hook form lib
/*
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <SlideDatePicker
            {...field}
            onChange={(value) => field.onChange(value)}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
*/