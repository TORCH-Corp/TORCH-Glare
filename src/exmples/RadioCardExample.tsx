import { Button } from "@/components/Button";
import { RadioCard } from "@/components/RadioCard";
import { cn } from "@/utils/cn";
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
        <RadioCard
          name={"radio-card"}
          id={"test234"}
          headerLabel={"RadioCard Header"}
          description={"this is a description for RadioCard"}
        >
          <Button size={"S"}>do something</Button>
        </RadioCard>
        <RadioCard
          name={"radio-card"}
          id={"test235"}
          headerLabel={"RadioCard Header"}
          description={"this is a description for RadioCard"}
        >
          <Button size={"S"}>do something</Button>
        </RadioCard>
        <RadioCard
          name={"radio-card"}
          id={"test2378"}
          headerLabel={"RadioCard Header"}
          description={"this is a description for RadioCard"}
        >
          <Button size={"S"}>do something</Button>
        </RadioCard>
      </div>
    </>
  );
}
