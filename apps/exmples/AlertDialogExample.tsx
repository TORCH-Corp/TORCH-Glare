import { FieldAlertDialog, FieldAlertDialogAction, FieldAlertDialogCancel, FieldAlertDialogContent, FieldAlertDialogDescription, FieldAlertDialogHeader, FieldAlertDialogLabel, FieldAlertDialogTitle, FieldAlertDialogTrigger } from "@/components/FieldAlertDialog";
import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function FieldAlertDialogExample() {
  const [variant] = useState<any>(["info", "success", "warning", "error", "default"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        StatusFieldAlertDialog Preview
      </h1>
      {
        variant.map((item: any) => (
          <div className="flex flex-col gap-2 w-full">
            <FieldAlertDialog>
              <FieldAlertDialogTrigger asChild>
                <Button variant="BorderStyle">{`Show Dialog type  ${item}`}</Button>
              </FieldAlertDialogTrigger>

              <FieldAlertDialogContent variant={item} >
                <FieldAlertDialogHeader>
                  <FieldAlertDialogTitle >
                    <FieldAlertDialogLabel title="Are you sure?" />
                  </FieldAlertDialogTitle>
                  <div className="flex justify-center items-center gap-2">
                    <FieldAlertDialogAction>Continue</FieldAlertDialogAction>
                    <span className="w-[1px] h-[28px] bg-border-presentation-action-disabled rounded-sm"></span>
                    <FieldAlertDialogCancel> <i className="ri-close-line"></i></FieldAlertDialogCancel>
                  </div>
                </FieldAlertDialogHeader>
                <FieldAlertDialogDescription  >
                  you cant undo this action if you click on continue.
                </FieldAlertDialogDescription>
              </FieldAlertDialogContent>
            </FieldAlertDialog>
          </div>
        ))
      }

    </>
  );
}
