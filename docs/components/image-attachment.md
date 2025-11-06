---
title: ImageAttachment
description: File upload component suite with drag-and-drop, preview thumbnails, and expandable modal view
group: Advanced Components
keywords: [image-attachment, file-upload, drag-drop, preview, modal, expandable]
---

# ImageAttachment

> A comprehensive file upload component suite featuring a drag-and-drop zone (ImageAttachment), thumbnail preview with expand capability (ExpandableImage), and full-size modal preview (AttachmentImagePreview). Perfect for building file upload interfaces with visual feedback.

## Installation

No external dependencies required.

## Import

```typescript
import {
  ImageAttachment,
  ExpandableImage,
  AttachmentImagePreview
} from '@torch-ui/components'
```

## Component Overview

The ImageAttachment suite consists of three components:

1. **ImageAttachment**: Drop zone and file input for uploading
2. **ExpandableImage**: Thumbnail preview with click-to-expand
3. **AttachmentImagePreview**: Full-size modal view with actions

## Quick Examples

### Basic File Upload

```typescript
import { ImageAttachment } from '@torch-ui/components'
import { useState } from 'react'

function Example() {
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <ImageAttachment
      mainLabel="Drop your image here"
      secondaryLabel="or click to browse"
      expandLabel="View"
      onChange={handleChange}
      accept="image/*"
    />
  )
}
```

### With Preview

```typescript
import { ImageAttachment, ExpandableImage } from '@torch-ui/components'
import { useState } from 'react'

function WithPreview() {
  const [preview, setPreview] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex gap-4">
      <ImageAttachment
        mainLabel="Upload Image"
        secondaryLabel="PNG, JPG up to 5MB"
        expandLabel="View"
        onChange={handleChange}
        accept="image/*"
      />

      {preview && (
        <ExpandableImage
          previewSrc={preview}
          expandLabel="Expand"
          placeholderLabel="Upload Image"
        />
      )}
    </div>
  )
}
```

### Complete Upload Flow

```typescript
import {
  ImageAttachment,
  ExpandableImage,
  AttachmentImagePreview
} from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function CompleteFlow() {
  const [preview, setPreview] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = () => {
    if (file) {
      // Upload logic here
      console.log('Uploading:', file.name)
    }
  }

  const handleRemove = () => {
    setPreview('')
    setFile(null)
  }

  return (
    <div className="flex gap-4">
      <ImageAttachment
        mainLabel="Drop image here"
        secondaryLabel="or click to browse"
        expandLabel="View"
        onChange={handleChange}
        accept="image/*"
      />

      {preview && (
        <ExpandableImage
          previewSrc={preview}
          expandLabel="Expand"
        >
          <AttachmentImagePreview
            src={preview}
            header={file?.name || 'Image Preview'}
          >
            <Button onClick={handleUpload}>Upload</Button>
            <Button variant="SecondaryStyle" onClick={handleRemove}>
              Remove
            </Button>
          </AttachmentImagePreview>
        </ExpandableImage>
      )}
    </div>
  )
}
```

### With Drag and Drop (React Dropzone)

```typescript
import { ImageAttachment, ExpandableImage } from '@torch-ui/components'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'

function WithDropzone() {
  const [preview, setPreview] = useState<string>('')

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  return (
    <div className="flex gap-4">
      <ImageAttachment
        mainLabel="Drop your image here"
        secondaryLabel="PNG, JPG, GIF up to 10MB"
        expandLabel="View"
        getRootProps={getRootProps}
        isDropAreaActive={isDragActive}
        {...getInputProps()}
      />

      {preview && (
        <ExpandableImage
          previewSrc={preview}
          expandLabel="Expand"
        />
      )}
    </div>
  )
}
```

### Multiple File Upload

```typescript
import { ImageAttachment, ExpandableImage } from '@torch-ui/components'
import { useState } from 'react'

function MultipleFiles() {
  const [previews, setPreviews] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-4">
      <ImageAttachment
        mainLabel="Upload Images"
        secondaryLabel="Select multiple files"
        expandLabel="View"
        onChange={handleChange}
        accept="image/*"
        multiple
      />

      <div className="flex gap-2 flex-wrap">
        {previews.map((preview, index) => (
          <ExpandableImage
            key={index}
            previewSrc={preview}
            expandLabel="Expand"
          />
        ))}
      </div>
    </div>
  )
}
```

### With Validation

```typescript
import { ImageAttachment } from '@torch-ui/components'
import { FieldHint, toast } from '@torch-ui/components'
import { useState } from 'react'

function WithValidation() {
  const [error, setError] = useState('')

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and GIF files are allowed'
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB'
    }

    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        toast.error(validationError)
        e.target.value = '' // Clear input
      } else {
        setError('')
        // Process file
        console.log('Valid file:', file.name)
      }
    }
  }

  return (
    <div className="space-y-2">
      <ImageAttachment
        mainLabel="Upload Image"
        secondaryLabel="PNG, JPG, GIF (max 5MB)"
        expandLabel="View"
        onChange={handleChange}
        accept="image/jpeg,image/png,image/gif"
      />

      {error && (
        <FieldHint state="error" label={error} />
      )}
    </div>
  )
}
```

### Profile Picture Upload

```typescript
import {
  ImageAttachment,
  ExpandableImage,
  AttachmentImagePreview
} from '@torch-ui/components'
import { Avatar, Button } from '@torch-ui/components'
import { useState } from 'react'

function ProfilePictureUpload() {
  const [preview, setPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    setUploading(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)
    toast.success('Profile picture updated!')
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar
        src={preview || '/default-avatar.png'}
        alt="Profile"
        size="L"
      />

      <div className="flex gap-4">
        <ImageAttachment
          mainLabel="Change Photo"
          secondaryLabel="Click to upload"
          expandLabel="View"
          onChange={handleChange}
          accept="image/*"
        />

        {preview && (
          <ExpandableImage
            previewSrc={preview}
            expandLabel="Preview"
          >
            <AttachmentImagePreview
              src={preview}
              header="Profile Picture"
            >
              <Button
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save'}
              </Button>
            </AttachmentImagePreview>
          </ExpandableImage>
        )}
      </div>
    </div>
  )
}
```

### Gallery Upload

```typescript
import { ImageAttachment, ExpandableImage } from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function GalleryUpload() {
  const [images, setImages] = useState<Array<{ id: string; url: string }>>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [
          ...prev,
          { id: Math.random().toString(), url: reader.result as string }
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemove = (id: string) => {
    setImages(images.filter(img => img.id !== id))
  }

  return (
    <div className="space-y-4">
      <ImageAttachment
        mainLabel="Add Photos"
        secondaryLabel="Upload up to 10 images"
        expandLabel="View"
        onChange={handleChange}
        accept="image/*"
        multiple
      />

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image.id} className="relative group">
              <ExpandableImage
                previewSrc={image.url}
                expandLabel="Expand"
              />
              <Button
                size="S"
                buttonType="icon"
                variant="SecondaryStyle"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                onClick={() => handleRemove(image.id)}
              >
                <i className="ri-close-line" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## API Reference

### ImageAttachment Props

Extends all input HTML attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mainLabel` | `string` | **required** | Primary label text |
| `secondaryLabel` | `string` | **required** | Secondary helper text |
| `expandLabel` | `ReactNode` | **required** | Label for expand action |
| `isDropAreaActive` | `boolean` | `false` | Active drag-over state |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `getRootProps` | `() => any` | - | React Dropzone root props |
| `children` | `ReactNode` | - | Additional content |
| `className` | `string` | - | Additional CSS classes |
| ...InputHTMLAttributes | - | - | All input attributes |

### ExpandableImage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `previewSrc` | `string` | **required** | Image source URL or data URL |
| `expandLabel` | `ReactNode` | **required** | Label shown on hover |
| `placeholderLabel` | `string` | `'Upload Image'` | Placeholder text when no image |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Modal content (AttachmentImagePreview) |
| ...HTMLDivAttributes | - | - | All div attributes |

### AttachmentImagePreview Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Full-size image source |
| `header` | `ReactNode` | - | Modal header text |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `children` | `ReactNode` | - | Action buttons |
| `className` | `string` | - | Additional CSS classes |
| ...HTMLDivAttributes | - | - | All div attributes |

## TypeScript

### Full Type Definitions

```typescript
import { InputHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

interface ImageAttachmentProps extends InputHTMLAttributes<HTMLInputElement> {
  isDropAreaActive?: boolean
  mainLabel: string
  secondaryLabel: string
  theme?: 'light' | 'dark' | 'default'
  expandLabel: ReactNode
  children?: ReactNode
  getRootProps?: () => any
}

interface ExpandableImageProps extends HTMLAttributes<HTMLDivElement> {
  previewSrc: string
  expandLabel: ReactNode
  placeholderLabel?: string
  theme?: 'light' | 'dark' | 'default'
}

interface AttachmentImagePreviewProps extends HTMLAttributes<HTMLDivElement> {
  src: string
  header?: ReactNode
  theme?: 'light' | 'dark' | 'default'
}

export const ImageAttachment: React.ForwardRefExoticComponent<
  ImageAttachmentProps & React.RefAttributes<HTMLInputElement>
>

export const ExpandableImage: React.FC<ExpandableImageProps>
export const AttachmentImagePreview: React.FC<AttachmentImagePreviewProps>
```

### Usage with Types

```typescript
import {
  ImageAttachment,
  ExpandableImage,
  AttachmentImagePreview
} from '@torch-ui/components'
import { useRef, useState } from 'react'

function TypedExample() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <ImageAttachment
      ref={inputRef}
      mainLabel="Upload"
      secondaryLabel="PNG or JPG"
      expandLabel="View"
      onChange={handleChange}
      accept="image/png,image/jpeg"
    />
  )
}
```

## Common Patterns

### Upload with Progress

```typescript
import { ImageAttachment } from '@torch-ui/components'
import { useState } from 'react'

function UploadWithProgress() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-2">
      <ImageAttachment
        mainLabel="Upload Image"
        secondaryLabel="PNG, JPG (max 5MB)"
        expandLabel="View"
        onChange={handleChange}
        disabled={uploading}
      />

      {uploading && (
        <div className="w-full bg-gray-200 rounded">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
```

### Image Cropper Integration

```typescript
import { ImageAttachment, ExpandableImage } from '@torch-ui/components'
import { useState } from 'react'
import Cropper from 'react-easy-crop'

function ImageCropper() {
  const [image, setImage] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <ImageAttachment
        mainLabel="Upload to Crop"
        secondaryLabel="Select an image"
        expandLabel="Crop"
        onChange={handleChange}
      />

      {image && (
        <div className="relative h-64">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </div>
      )}
    </div>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  ImageAttachment,
  ExpandableImage,
  AttachmentImagePreview
} from '@torch-ui/components'

describe('ImageAttachment', () => {
  it('renders labels', () => {
    render(
      <ImageAttachment
        mainLabel="Upload"
        secondaryLabel="Click to browse"
        expandLabel="View"
      />
    )

    expect(screen.getByText('Upload')).toBeInTheDocument()
    expect(screen.getByText('Click to browse')).toBeInTheDocument()
  })

  it('handles file selection', async () => {
    const handleChange = jest.fn()

    render(
      <ImageAttachment
        mainLabel="Upload"
        secondaryLabel="Browse"
        expandLabel="View"
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox', { hidden: true }) as HTMLInputElement
    const file = new File(['test'], 'test.png', { type: 'image/png' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('shows active state when dragging', () => {
    const { container } = render(
      <ImageAttachment
        mainLabel="Upload"
        secondaryLabel="Drop here"
        expandLabel="View"
        isDropAreaActive
      />
    )

    // Check for active styling
    expect(container.querySelector('.bg-background-presentation-action-hovercontstyle')).toBeInTheDocument()
  })
})

describe('ExpandableImage', () => {
  it('renders placeholder when no image', () => {
    render(
      <ExpandableImage
        previewSrc=""
        expandLabel="Expand"
        placeholderLabel="No Image"
      />
    )

    expect(screen.getByText('No Image')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(
      <ExpandableImage
        previewSrc="data:image/png;base64,test"
        expandLabel="Expand"
      />
    )

    const img = document.querySelector('img')
    expect(img).toHaveAttribute('src', 'data:image/png;base64,test')
  })

  it('shows expand button on hover', async () => {
    render(
      <ExpandableImage
        previewSrc="data:image/png;base64,test"
        expandLabel="Expand"
      />
    )

    const expandButton = screen.getByText('Expand')
    expect(expandButton).toBeInTheDocument()
  })
})

describe('AttachmentImagePreview', () => {
  it('renders header and image', () => {
    render(
      <AttachmentImagePreview
        src="test.jpg"
        header="Test Image"
      />
    )

    expect(screen.getByText('Test Image')).toBeInTheDocument()
    expect(document.querySelector('img')).toHaveAttribute('src', 'test.jpg')
  })

  it('renders action buttons', () => {
    render(
      <AttachmentImagePreview
        src="test.jpg"
        header="Image"
      >
        <button>Save</button>
        <button>Cancel</button>
      </AttachmentImagePreview>
    )

    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })
})
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support for file input
- **Screen Readers**: Labels announced correctly
- **ARIA Attributes**: Proper button roles and labels
- **Focus Management**: Focus trapped in modal when expanded
- **File Input**: Hidden but accessible to assistive tech

### Accessibility Best Practices

```typescript
// Provide clear labels
<ImageAttachment
  mainLabel="Upload Profile Picture"
  secondaryLabel="JPEG or PNG, max 5MB"
  expandLabel="View full size"
  aria-label="Upload profile picture"
/>

// Add file type context
<ImageAttachment
  mainLabel="Upload Document"
  secondaryLabel="Accepted: PDF, DOC, DOCX (max 10MB)"
  expandLabel="Preview"
  accept=".pdf,.doc,.docx"
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~8kb |
| Bundle size (gzipped) | ~3kb |
| Dependencies | AlertDialog, Button |
| Image processing | Client-side (FileReader) |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Optimize image size**: Compress before upload
2. **Lazy load previews**: Only generate when needed
3. **Limit simultaneous uploads**: Queue multiple files
4. **Use object URLs**: More efficient than data URLs for large files
   ```typescript
   const objectUrl = URL.createObjectURL(file)
   // Remember to revoke: URL.revokeObjectURL(objectUrl)
   ```

## Styling

### Custom Styles

```typescript
// Custom drop zone
<ImageAttachment
  className="bg-blue-50 border-blue-300"
  mainLabel="Drop here"
  secondaryLabel="Custom styled"
  expandLabel="View"
/>

// Custom preview size
<ExpandableImage
  className="w-32 h-32"
  previewSrc={preview}
  expandLabel="Expand"
/>
```

### Default Styling

- Drop Zone: 200px min-width, 65px height, dashed border
- Preview: 180px max-width, 65px height, rounded corners
- Active State: Background and border color change
- Hover: Expand button overlay with icon

## Best Practices

1. **Validate files**: Check type and size before processing
2. **Provide feedback**: Show upload progress and errors
3. **Clear labels**: Describe accepted formats and limits
4. **Handle errors**: Gracefully handle file read failures
5. **Optimize images**: Compress or resize on client before upload
6. **Cleanup**: Revoke object URLs when done
7. **Accessibility**: Ensure keyboard and screen reader support
8. **Multiple files**: Consider UX for bulk uploads

## Related Components

- [Button](./button.md) - Action buttons
- [AlertDialog](./alert-dialog.md) - Modal container for preview
- [Avatar](./avatar.md) - Profile picture display
- [FieldHint](./field-hint.md) - Validation messages
- [Toast](./toast.md) - Upload notifications
