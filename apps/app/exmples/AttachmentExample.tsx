"use client";

import { useRef, useState } from "react";

import { AlertDialogAction } from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import {
  AttachmentImagePreview,
  ExpandableImage,
  ImageAttachment,
} from "@/components/ImageAttachment";
import { cn } from "@/utils/cn";

export default function AttachmentExample() {
  // Empty string (not null) — `previewSrc` / `src` are `string`, and a falsy value
  // renders the placeholder.
  const [preview, setPreview] = useState<string>("");

  // Ref to the hidden file input (ImageAttachment forwards its ref there), so Reset can
  // clear the input value as well as the preview.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <h1 className={cn("text-xl font-bold mb-8", "text-content-system-global-primary")}>
        Attachment Preview
      </h1>
      <div className="flex w-full flex-col gap-2">
        <ImageAttachment
          ref={fileInputRef}
          id="upload-simple-example"
          mainLabel="Click To Upload"
          secondaryLabel="Upload an image"
          accept="image/*"
          onChange={handleFileChange}
        >
          {/* The preview thumbnail; clicking it (when set) opens the expand dialog. */}
          <ExpandableImage previewSrc={preview} expandLabel="Expand Pic">
            <AttachmentImagePreview src={preview} header="Preview">
              <AlertDialogAction asChild>
                <Button onClick={handleReset}>Reset</Button>
              </AlertDialogAction>
            </AttachmentImagePreview>
          </ExpandableImage>
        </ImageAttachment>
      </div>
    </>
  );
}
