import HeaderBar from "@/components/HeaderBar";
import { cn } from "@/utils/cn";

const VARIANTS = [
  {
    variant: "new",
    label: "New",
    title: "sales iNVOICE",
    caption: "new",
  },
  {
    variant: "edit",
    label: "edit",
    title: "sales iNVOICE",
    caption: "edit",
  },
  {
    variant: "detail",
    label: "de-344",
    title: "sales iNVOICE",
    caption: "detail",
  },
] as const;

export default function HeaderBarExample() {
  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary",
        )}
      >
        HeaderBar Preview
      </h1>

      <div className="flex flex-col gap-6">
        {VARIANTS.map(({ variant, label, title, caption }) => (
          <div key={variant} className="flex flex-col items-start gap-2">
            <span className="text-sm text-content-system-global-primary">
              {caption}
            </span>
            <HeaderBar variant={variant} label={label} title={title} />
          </div>
        ))}
      </div>
    </>
  );
}
