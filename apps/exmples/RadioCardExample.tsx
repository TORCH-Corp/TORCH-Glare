import { Button } from "@/components/Button";
import { RadioGroup } from "@/components/Radio";
import { RadioCard } from "@/components/RadioCard";
import { cn } from "@/utils/cn";

export function RadioCardExample() {

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        RadioCard Preview
      </h1>
      <div className="flex flex-col gap-2 w-full max-w-[500px]">
        <RadioGroup>
          <RadioCard
            id={"test234"}
            value={"dsddadas"}
            headerLabel={"RadioCard Header"}
            description={"this is a description for RadioCard"}
          >
            <Button size={"S"}>do something</Button>
          </RadioCard>
          <RadioCard
            id={"test235"}
            headerLabel={"RadioCard Header"}
            description={"this is a description for RadioCard"}
            value={"dsdddsds"}
          >
            <Button size={"S"}>do something</Button>
          </RadioCard>
          <RadioCard
            id={"test2378"}
            headerLabel={"RadioCard Header"}
            description={"this is a description for RadioCard"}
            value={"dsds"}          >
            <Button size={"S"}>do something</Button>
          </RadioCard>
        </RadioGroup>
      </div>
    </>
  );
}
