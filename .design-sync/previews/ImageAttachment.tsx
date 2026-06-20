import React from "react";
import { ImageAttachment, ExpandableImage } from "torch-glare";

// A small inline image so the preview renders deterministically (no network).
const sampleImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'>
       <defs>
         <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
           <stop offset='0' stop-color='#5317FF'/>
           <stop offset='1' stop-color='#D500F9'/>
         </linearGradient>
       </defs>
       <rect width='240' height='160' fill='url(#g)'/>
       <text x='50%' y='52%' fill='#fff' font-family='sans-serif'
             font-size='20' text-anchor='middle'>cover.png</text>
     </svg>`,
  );

// Canonical drop zone for uploading an image.
export const DropZone = () => (
  <div style={{ width: 360 }}>
    <ImageAttachment
      mainLabel="Drag & drop or browse"
      secondaryLabel="PNG, JPG up to 10MB"
      expandLabel="Expand"
      accept="image/*"
    />
  </div>
);

// Active drop state (highlighted) shown statically.
export const DropActive = () => (
  <div style={{ width: 360 }}>
    <ImageAttachment
      isDropAreaActive
      mainLabel="Release to upload"
      secondaryLabel="PNG, JPG up to 10MB"
      expandLabel="Expand"
      accept="image/*"
    />
  </div>
);

// Expandable thumbnail with a selected image, alongside the empty placeholder.
export const Preview = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <ExpandableImage previewSrc={sampleImage} expandLabel="Expand" />
    <ExpandableImage previewSrc={undefined} expandLabel="Expand" placeholderLabel="Upload Image" />
  </div>
);
