import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import { InputField } from "@/components/InputField";
import { cn } from "@/utils/cn";
import { useState, type ComponentProps } from "react";

export default function DatePickerExample() {
  const [anotherSizes] = useState<NonNullable<ComponentProps<typeof InputField>["size"]>[]>(["S", "M"]);
  const [error, setError] = useState(false);

  return (
    <>
      <h1
        className={cn("text-2xl", {
          "text-content-presentation-global-primary": true

        })}
      >
        DatePicker Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size) =>
        <div key={`${size}`} className="">
          <h2
            className={cn("text-lg font-semibold", {
              "text-content-presentation-global-primary": true

            })}
          >{`Size: ${size}`}</h2>
          {/* The custom trigger is a CHILD, not a `customInput` prop — `DatePicker` clones it and
              feeds it the formatted value. */}
          <DatePicker onChange={(e: unknown) => console.log(e)}>
            <InputField errorMessage={error ? "This is an error message" : undefined} size={size} />
          </DatePicker>
        </div>
      )}

      {/* Toggle Error State */}
      <Button
        onClick={() => setError((prev) => !prev)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Toggle Error State
      </Button>
    </>
  );
}



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