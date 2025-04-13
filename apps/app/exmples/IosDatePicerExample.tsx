import { Button } from "@/components/Button";
import { IosDatePicker } from "@/components/IosDatePicker-dev";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function IosDatePickerExample() {
  const [anotherSizes] = useState<any>(["M"]);
  const [error, setError] = useState(false);

  return (
    <>
      <h1
        className={cn("text-2xl", {
          "text-content-system-global-primary": true

        })}
      >
        IOS DatePicker Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size: any) =>
        <div key={`${size}`} className="">
          <h2
            className={cn("text-lg font-semibold", {
              "text-content-system-global-primary": true

            })}
          >{` Size: ${size}`}</h2>
          <IosDatePicker
            size={size}
            errorMessage={error ? "This is an error message" : undefined}
          />
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