# Attachment Preview Component

## Overview
The `AttachmentExample` component demonstrates how to combine `AttachmentField`, `AttachedPic`, and `PicContainer` into a seamless workflow for uploading and previewing images.

## Features
- **File Upload**
  - Users can drag and drop files into `AttachmentField` or click to upload.
  - The uploaded image is displayed in `PicContainer`.
- **Image Preview**
  - Users can view the uploaded image in `PicContainer`.
  - Clicking the expand button opens a full preview.
- **Expanded Preview**
  - `AttachedPic` displays the image in an expanded view.
  - Users can close the preview by clicking the close button.

## Installation and Setup

### Add The Components

Run this command to install the components:
```bash
npx torchcorp@latest add AttachmentField

npx torchcorp@latest add PicContainer

npx torchcorp@latest add AttachedPic
```

## Example Usage

```jsx
import { AttachedPic } from "@/components/AttachedPic";
import { AttachmentField } from "@/components/AttachmentField";
import { PicContainer } from "@/components/PicContainer";
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
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-1 relative">
          <PicContainer
            hasExpand
            onExpand={() => setIsPreviewOpen(true)}
            {...getInputProps()}
            selectedImg={preview}
          />
          <AttachmentField
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            mainLabel={"Drop Here"}
            secondaryLabel={"Drop an image"}
          />
          <div className="absolute right-0 bottom-0">
            {isPreviewOpen && (
              <AttachedPic
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
```



# API 

## **1. `AttachmentField` Component**
### Props
| Prop Name         | Type                                      | Required | Description |
|------------------|---------------------------------|----------|-------------|
| `getRootProps`   | `() => any`                     | ❌       | Function returning props for the root component from `react-dropzone`. |
| `getInputProps`  | `() => any`                     | ❌       | Function returning props for the input component from `react-dropzone`. |
| `isDropAreaActive` | `boolean`                   | ❌       | Controls whether the drop area is active (changes styles based on this state). |
| `mainLabel`      | `string`                        | ✅       | Primary text displayed inside the drop zone. |
| `secondaryLabel` | `string`                        | ✅       | Secondary text displayed inside the drop zone. |
| `theme`          | `"dark" | "light" | "default"` | ❌       | Controls theming (applies CSS styles accordingly). |

---

## **2. `AttachedPic` Component**
### Props
| Prop Name  | Type                                      | Required | Description |
|------------|--------------------------------|----------|-------------|
| `src`      | `any`                          | ✅       | Source URL or blob for the image. |
| `header`   | `ReactNode`                    | ❌       | Title/header displayed at the top. |
| `onHide`   | `() => void`                   | ❌       | Function to hide/remove the image when the close button is clicked. |
| `theme`    | `"dark" | "light" | "default"` | ❌       | Controls theming (affects styling). |

---

## **3. `PicContainer` Component**
### Props
| Prop Name      | Type                                      | Required | Description |
|---------------|--------------------------------|----------|-------------|
| `id`          | `string`                        | ✅       | Unique identifier for the input field. |
| `selectedImg` | `any`                           | ✅       | Selected image source (URL or blob). |
| `onExpand`    | `() => void`                    | ❌       | Function triggered when expanding the image. |
| `expandLabel` | `string`                        | ❌       | Label for the expand button (default: `"Expand Pic"`). |
| `hasExpand`   | `boolean`                       | ❌       | Determines whether the expand button should be displayed. |
| `theme`       | `"dark" | "light" | "default"` | ❌       | Controls theming. |

---




