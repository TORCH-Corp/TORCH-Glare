import { forwardRef, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
} from "./AlertDialog";

const dropZoneStyles = cva(
  [
    // Dashed drop zone that fills the field box (design: Attachment-Field-1.0 "Upload-Button").
    // Transparent fill so the surrounding #f9f9f9 box shows through the dashed border.
    "flex-1 h-[65px] flex flex-col rounded-[8px] border-dashed !border-2 transition-all duration-300 ease-in-out",
    "!border-border-presentation-action-borderstyle bg-transparent",
    "hover:bg-background-presentation-badge-gray-subtle",
  ],
  {
    variants: {
      active: {
        true: "!bg-background-presentation-badge-gray-subtle !border-border-presentation-badge-gray",
      },
    },
  },
);

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLDivElement> {
  isDropAreaActive?: boolean;
  mainLabel: string;
  secondaryLabel: string;
  theme?: Themes;
  expandLabel?: ReactNode;
  children?: ReactNode;
  getRootProps?: () => Record<string, unknown>;
}

const ImageAttachment = forwardRef<HTMLInputElement, Props>(
  (
    {
      isDropAreaActive,
      mainLabel,
      theme,
      secondaryLabel,
      className,
      getRootProps,
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluded from {...props} so it isn't leaked onto the <input>
      expandLabel,
      ...props
    }: Props,
    ref,
  ) => {
    return (
      // The #f9f9f9 field box (design: Attachment-Field-1.0). Holds an optional preview
      // (children) on the leading side and the dashed drop zone filling the rest.
      <section
        className={cn(
          "flex w-full items-center gap-[10px] rounded-[8px] bg-background-presentation-form-field-primary",
          className,
        )}
      >
        {children}
        <Button
          {...getRootProps?.()}
          theme={theme}
          as="label"
          id={props.id}
          variant="PrimeContStyle"
          className={cn(dropZoneStyles({ active: isDropAreaActive }))}
          containerClassName="flex-col"
        >
          <h1 className="text-content-presentation-action-light-primary typography-body-large-medium">
            {mainLabel}
          </h1>
          <p className="text-content-presentation-action-light-secondary typography-body-small-medium">
            {secondaryLabel}
          </p>
          <input ref={ref} {...props} type="file" hidden />
        </Button>
      </section>
    );
  },
);

ImageAttachment.displayName = "ImageAttachment";

export { ImageAttachment, ExpandableImage, AttachmentImagePreview };

interface ExpandableImageProps extends HTMLAttributes<HTMLDivElement> {
  previewSrc: string;
  expandLabel: ReactNode;
  placeholderLabel?: string;
  theme?: Themes;
}

const ExpandableImage = ({
  theme,
  previewSrc,
  expandLabel,
  placeholderLabel = "Upload Image",
  className,
  ...props
}: ExpandableImageProps) => {
  return (
    // Pic-Container-1.0: a 65×65 square thumbnail (or the placeholder), with an Expand
    // overlay revealed on hover.
    <section
      style={props.style}
      data-theme={theme}
      className={cn(
        "group relative flex size-[65px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border-none",
        className,
      )}
    >
      {previewSrc ? <SelectedImg src={previewSrc} /> : <PlaceHolder label={placeholderLabel} />}

      {previewSrc && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-[2px] bg-black/50 opacity-0 transition-all duration-200 ease-in-out hover:opacity-100">
              <i className="ri-fullscreen-line text-content-presentation-global-hover text-[24px] leading-none" />
              <p className="text-content-presentation-global-hover typography-labels-small-regular m-0 max-w-[50px] break-words text-center">
                {expandLabel}
              </p>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-fit bg-transparent border-none">
            {props.children}
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  );
};

function PlaceHolder({ label }: { label: string }) {
  return (
    // Pic-Container-1.0 default: ocean fill + dashed blue-purple border; on hover it goes gray.
    // (Was styled with a `badge-blue-purple` token that does not exist — a no-op until now.)
    <section
      className={cn([
        "size-[65px] gap-[2px] flex flex-col justify-center items-center px-1",
        " rounded-[8px] border-2 border-dashed",
        " border-blue-purple-300 bg-background-presentation-badge-ocean-subtle",
        " transition-all duration-300 ease-in-out",
        " group-hover:bg-background-presentation-badge-gray-subtle group-hover:border-border-presentation-badge-gray",
      ])}
    >
      <i className="ri-attachment-line text-blue-purple-800 group-hover:text-content-presentation-badge-gray text-[24px] h-[24px]"></i>
      <p className="text-blue-purple-800 typography-labels-small-regular group-hover:text-content-presentation-badge-gray px-1 py-[2px] text-center">
        {label}
      </p>
    </section>
  );
}

function SelectedImg({ src }: { src: string }) {
  return (
    <section className="size-full shrink-0 overflow-hidden rounded-[8px] border border-border-presentation-global-primary bg-white">
      <img alt="" src={src} className="h-full w-full object-cover object-center" />
    </section>
  );
}

interface AttachmentImagePreviewProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  header?: ReactNode;
  theme?: Themes;
}

function AttachmentImagePreview({
  theme,
  src,
  header,
  className,
  ...props
}: AttachmentImagePreviewProps) {
  return (
    <section
      {...props}
      data-theme={theme}
      className={cn(
        " overflow-hidden flex flex-col items-center justify-center w-80 p-2 gap-2 rounded-md border shadow-md border-border-presentation-global-primary bg-background-presentation-form-base",
        className,
      )}
    >
      <section className="flex items-center justify-between w-full m-0">
        <p className="m-0 text-content-presentation-global-primary typography-display-medium-semibold">
          {header}
        </p>
        <AlertDialogCancel asChild>
          <Button theme={theme} size="M" buttonType="icon">
            <i className="ri-close-line text-[16px]"></i>
          </Button>
        </AlertDialogCancel>
      </section>

      <img
        className="w-full object-cover object-center rounded-md  border shadow-md border-border-presentation-global-primary"
        src={src}
      />

      <section className="flex items-center justify-end w-full gap-2">{props.children}</section>
    </section>
  );
}
