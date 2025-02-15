import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";
import { Controller, useForm } from 'react-hook-form'
import { Datepicker } from "@/components/base/DatePicker";

function App() {

  const { updateTheme } = useTheme()
  useEffect(() => {
    updateTheme("dark")
  }, [])

  const { control, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <Datepicker
            {...field}
            onChange={(value: Date) => field.onChange(value)}
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