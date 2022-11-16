import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

function App() {
  const UploadExample = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [image, setImage] = useState<Image | null>(null);

    const onUpload = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
      // Reference to the DOM input element
      const { files } = event.target;

      // Ensure that you have a file before attempting to read it
      if (files && files[0]) {
        // Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(files[0]);

        // Remember the fallback type:
        const typeFallback = files[0].type;

        // Create a new FileReader to read this image binary data
        const reader = new FileReader();

        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          setImage({
            // Read image as base64 and set it as src:
            src: blob,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: getMimeType(e.target?.result, typeFallback),
          });
        };
        // Start the reader job - read file as a data url (base64 format) and get the real file type
        reader.readAsArrayBuffer(files[0]);
      }
      // Clear the event target value to give the possibility to upload the same image:
      event.target.value = '';
    };

    useEffect(() => {
      // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
      return () => {
        if (image && image.src) {
          URL.revokeObjectURL(image.src);
        }
      };
    }, [image]);

    return (
      <div className="upload-example">
        <Cropper className="upload-example__cropper" src={image && image.src} />
        <div className="buttons-wrapper">
          <button className="button" onClick={onUpload}>
            <input ref={inputRef} type="file" accept="image/*" onChange={onLoadImage} />
            Upload image
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: 800, height: 800 }}>
      <GettingStartedExample />
    </div>
  );
}

export default App;
