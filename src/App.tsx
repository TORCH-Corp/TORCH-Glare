
import { AttachedPic, PicContainer, convertImageFileToDataUrl } from "./lib";
import { useState, ChangeEvent } from "react";

function App() {

  const [imageSrc, setImageSrc] = useState<string>("");
  const [imagePreviewActive, setImagePreviewActive] = useState<boolean>(false);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    convertImageFileToDataUrl(file, setImageSrc)
  }

  return (
    <section className="attachment-wrapper">
      <PicContainer onChange={handleFileChange} id={"test"} selectedImg={imageSrc} ExpandImageClick={() => setImagePreviewActive(true)} />
      {imagePreviewActive &&
        <AttachedPic headerLabel="Preview" style={{ position: "absolute", top: "0" }} src={imageSrc} changeLabel="Change" deleteLabel="Delete" deleteButtonClick={() => setImageSrc("")} changeButtonClick={() => setImageSrc("")} closeButtonClick={() => setImagePreviewActive(false)} />}
    </section>
  );
}

export default App;




/* 
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const onDrop = useCallback((acceptedFiles: any) => {
    setImage(acceptedFiles[0]);
    convertImageFileToDataUrl(acceptedFiles[0], setImageSrc)
  }, [])

    const [image, setImage] = useState<File | null>(null);

      <AttachmentField mainLabel="Attach File" secondaryLabel="or drag and drop" isDropAreaActive={isDragActive} getInputProps={getInputProps} getRootProps={getRootProps} />

*/