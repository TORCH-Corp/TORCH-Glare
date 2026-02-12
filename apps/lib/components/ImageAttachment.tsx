import { forwardRef, HTMLAttributes, InputHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { Button } from "./Button";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import type { Themes } from "../utils/types";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogCancel } from "./AlertDialog";

const dropZoneStyles = cva(
  [
    "w-full min-w-[200px] h-[65px] flex flex-col rounded-lg border-dashed !border-2 transition-all duration-300 ease-in-out ",
    "!border-border-presentation-action-borderstyle bg-background-presentation-badge-gray",
    "hover:border-border-presentation-action-borderstyle  hover:bg-background-presentation-badge-gray",
  ],
  {
    variants: {
      active: {
        true: "bg-background-presentation-action-hovercontstyle border-border-presentation-badge-gray",
      },
    },
  }
);

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLDivElement> {
  isDropAreaActive?: boolean;
  mainLabel: string;
  secondaryLabel: string;
  theme?: Themes
  expandLabel: ReactNode
  children?: ReactNode
  getRootProps?: () => any
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
      ...props
    }: Props,
    ref
  ) => {
    return (
      <section
        className={cn("flex items-center justify-center gap-1 w-full", className)}>
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
  }
);

ImageAttachment.displayName = "ImageAttachment"

export {
  ImageAttachment,
  ExpandableImage,
  AttachmentImagePreview
}


interface ExpandableImageProps extends HTMLAttributes<HTMLDivElement> {
  previewSrc: any
  expandLabel: ReactNode
  placeholderLabel?: string
  theme?: Themes
}

const ExpandableImage = ({ theme, previewSrc, expandLabel, placeholderLabel = "Upload Image", className, ...props }: ExpandableImageProps) => {
  // Calculate the aspect ratio of the image
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  useEffect(() => {
    if (!previewSrc) return;
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = width / height;
      setAspectRatio(ratio);
    };
    img.src = previewSrc;
  }, [previewSrc]);

  return (
    <section style={props.style} data-theme={theme} className={cn("flex items-center justify-center rounded-md relative overflow-hidden border-none group h-[65px]  max-w-[180px]", className)}>
      {previewSrc ? <SelectedImg aspectRatio={aspectRatio} src={previewSrc} /> : <PlaceHolder label={placeholderLabel} />}

      {
        previewSrc && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className='flex w-full h-full justify-center items-center flex-col absolute z-10 opacity-0 bg-black/50 transition-all duration-250 ease-in-out hover:opacity-100'
              >
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 3.5L17.8 5.8L14.91 8.67L16.33 10.09L19.2 7.2L21.5 9.5V3.5H15.5ZM3.5 9.5L5.8 7.2L8.67 10.09L10.09 8.67L7.2 5.8L9.5 3.5H3.5V9.5ZM9.5 21.5L7.2 19.2L10.09 16.33L8.67 14.91L5.8 17.8L3.5 15.5V21.5H9.5ZM21.5 15.5L19.2 17.8L16.33 14.91L14.91 16.33L17.8 19.2L15.5 21.5H21.5V15.5Z" fill="#F9F9F9" />
                </svg>
                <p className='text-content-presentation-action-hover typography-labels-small-regular max-w-[50px] break-words m-0'>
                  {expandLabel}
                </p>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-fit bg-transparent border-none">
              {props.children}
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    </section>
  );
}


function PlaceHolder({ label }: any) {
  return (
    <section className={cn([
      'w-[65px] h-full gap-[2px] flex flex-col justify-center items-center px-1 ',
      ' rounded-lg border-2 border-dashed',
      ' border-border-presentation-badge-blue-purple',
      ' bg-background-presentation-badge-blue-purple',
      ' transition-all duration-300 ease-in-out',
      ' hover:bg-background-presentation-badge-gray hover:border-border-presentation-badge-gray']
    )}>
      <i className="ri-attachment-line text-content-presentation-badge-blue-purple group-hover:text-[#797C7F] text-[24px] h-[24px]"></i>
      <p className='text-content-presentation-badge-blue-purple typography-labels-small-regular group-hover:text-[#797C7F] px-1 py-[2px] text-center'>{label}</p>
    </section>
  )
}



function SelectedImg({ src, aspectRatio }: any) {
  return (
    <section style={{ aspectRatio: aspectRatio }} className='bg-white w-full h-full rounded-md border border-border-presentation-global-primary shrink-0'>
      <img src={src} className='object-center object-cover h-full w-full' />
    </section>
  );
}


interface AttachmentImagePreviewProps extends HTMLAttributes<HTMLDivElement> {
  src: any;
  header?: ReactNode;
  theme?: Themes
}

function AttachmentImagePreview({ theme, src, header, className, ...props }: AttachmentImagePreviewProps) {
  return (
    <section
      {...props}
      data-theme={theme}
      className={cn(
        " overflow-hidden flex flex-col items-center justify-center w-80 p-2 gap-2 rounded-md border shadow-md border-border-presentation-global-primary bg-background-presentation-form-base",
        className
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

      <img className="w-full object-cover object-center rounded-md  border shadow-md border-border-presentation-global-primary" src={src} />

      <section className="flex items-center justify-end w-full gap-2">
        {props.children}
      </section>
    </section>
  );
}
