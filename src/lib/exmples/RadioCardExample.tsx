import { Button } from "@/components/base/Button";
import { RadioCard } from "@/components/base/RadioCard";
import { cn } from "@/components/base/utils";
import { useTheme } from "@/providers/ThemeProvider";

export function RadioCardExample() {
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        RadioCard Preview
      </h1>
      <div className="flex flex-col gap-2 w-full max-w-[500px]">
        <RadioCard id={"test23"} headerLabel={"RadioCard Header"} description={"this is a description for RadioCard"} >
          <Button size={"S"}>do something</Button>
        </RadioCard>
      </div>
    </>
  );
}
