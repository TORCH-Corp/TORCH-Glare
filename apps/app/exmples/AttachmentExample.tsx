import { AlertDialogAction } from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import { AttachmentImagePreview, ExpandableImage, ImageAttachment } from "@/components/ImageAttachment";
import { cn } from "@/utils/cn";
import { useRef, useState } from "react";


export default function AttachmentExample() {
  const [preview, setPreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Add a ref to access the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }



  // Create a reset handler that clears both preview and file input
  const handleReset = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Attachment Preview
      </h1>
      <div className="flex flex-col gap-2 w-full">

        <ImageAttachment
          id={'upload-simple-example'}
          onChange={handleFileChange}
          mainLabel={"Click To Upload"}
          secondaryLabel={"Upload an image"}
          expandLabel={"Expand Pic"}
          ref={fileInputRef}
          style={{
            aspectRatio: 1 / 1
          }}
        >
          <ExpandableImage
            previewSrc={preview}
            expandLabel={"Expand Pic"}
          >
            <AttachmentImagePreview
              src={preview}
            >
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
