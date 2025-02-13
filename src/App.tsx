import { SlideDatePicker } from "@/components/base/SlideDatePicker";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form"
function App() {

  const { updateTheme } = useTheme()
  useEffect(() => {
    updateTheme("dark")
  }, [])
  const { control, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data.date);
  };

  return (
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
  );
}
export default App;
