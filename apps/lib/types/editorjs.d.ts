declare module "@editorjs/checklist" {
  import { BlockToolConstructable } from "@editorjs/editorjs";
  const Checklist: BlockToolConstructable;
  export default Checklist;
}

declare module "@editorjs/embed" {
  import { BlockToolConstructable } from "@editorjs/editorjs";
  const Embed: BlockToolConstructable;
  export default Embed;
}

declare module "@editorjs/link" {
  import { BlockToolConstructable } from "@editorjs/editorjs";
  const LinkTool: BlockToolConstructable;
  export default LinkTool;
}

declare module "@editorjs/simple-image" {
  import { BlockToolConstructable } from "@editorjs/editorjs";
  const SimpleImage: BlockToolConstructable;
  export default SimpleImage;
}

declare module "@editorjs/raw" {
  import { BlockToolConstructable } from "@editorjs/editorjs";
  const RawTool: BlockToolConstructable;
  export default RawTool;
}

declare module "@editorjs/marker" {
  import { InlineToolConstructable } from "@editorjs/editorjs";
  const Marker: InlineToolConstructable;
  export default Marker;
}

declare module "@editorjs/text-variant-tune" {
  import { BlockTuneConstructable } from "@editorjs/editorjs";
  const TextVariantTune: BlockTuneConstructable;
  export default TextVariantTune;
}
