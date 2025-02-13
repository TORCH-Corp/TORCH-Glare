import { Button } from "@/components/base/Button";
import { SlideDatePicker } from "@/components/base/SlideDatePicker";
import { cn } from "@/components/base/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function SlideDatePickerExample() {
  const { theme } = useTheme();
  const [anotherSizes] = useState<any>(["S", "M"]);
  const variants = ["PresentationStyle", "SystemStyle"];
  const [error, setError] = useState(false);

  return (
    <>
      <h1
        className={cn("text-2xl", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        SlideDatePicker Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size: any) =>
        variants.map((variant: any) => (
          <div key={`${size}-${variant}`} className="">
            <h2
              className={cn("text-lg font-semibold", {
                "text-black": theme === "light",
                "text-white": theme === "dark",
              })}
            >{`Variant: ${variant}, Size: ${size}`}</h2>
            <SlideDatePicker
              size={size}
              variant={variant}
              errorMessage={error ? "This is an error message" : undefined}
            />
          </div>
        ))
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