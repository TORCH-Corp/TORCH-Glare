import { Controller, useForm } from 'react-hook-form'
import { Datepicker } from "@/components/base/DatePicker";
import { InputField } from "@/components/base/InputField";

function App() {

  const { control, handleSubmit, setValue } = useForm()

  const onSubmit = (data: any) => {
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} data-theme={"light"}>
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <Datepicker
              {...field}
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

      <form onSubmit={handleSubmit(onSubmit)} >
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <Datepicker
              {...field}
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
    </div>

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