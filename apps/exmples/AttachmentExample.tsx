import { AttachmentImagePreview, ImageAttachment } from "@/components/ImageAttachment";
import { cn } from "@/utils/cn";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function AttachmentExample() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string); // Set the image preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
        <div className="flex gap-1 relative" >
          <ImageAttachment
            getRootProps={getRootProps}
            {...getInputProps()}
            onExpand={() => setIsPreviewOpen(true)}
            uploadedImage={preview}
            expandLabel={"Expand Pic"}
            mainLabel={"Drop Here"}
            secondaryLabel={"Drop an image"}

          />
          <div className="absolute right-0 bottom-0">
            {isPreviewOpen && (
              <AttachmentImagePreview
                onHide={() => setIsPreviewOpen(!isPreviewOpen)}
                src={preview}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
