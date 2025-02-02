import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Rnd } from "react-rnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import html2canvas from "html2canvas";

const ImageCollageCreator = () => {
  const [images, setImages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [texts, setTexts] = useState([]);
  const collageRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
        position: { x: 0, y: 0, width: 100, height: 100 },
      });
    });
    setImages([...images, ...newImages]);
  };

  const addText = () => {
    setTexts([...texts, { text: "New Text", x: 50, y: 50, editing: true }]);
  };

  const handleTextClick = (index) => {
    const newTexts = texts.map((text, i) =>
      i === index ? { ...text, editing: true } : text
    );
    setTexts(newTexts);
  };

  const handleTextChange = (index, event) => {
    const newTexts = texts.map((text, i) =>
      i === index ? { ...text, text: event.target.value } : text
    );
    setTexts(newTexts);
  };

  const handleTextBlur = (index) => {
    setTimeout(() => {
      const newTexts = texts.map((text, i) =>
        i === index ? { ...text, editing: false } : text
      );
      setTexts(newTexts);
    }, 200);
  };

  const exportCollage = () => {
    if (collageRef.current) {
      html2canvas(collageRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "collage.png";
        link.click();
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  return (
    <div className="p-6 flex flex-col items-center">
      <Card className="w-full max-w-2xl p-4 border-dashed border-2 border-gray-300 text-center">
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <PlusCircle className="w-10 h-10 mx-auto text-gray-500" />
          <p className="text-gray-500">Drag & drop images here or click to upload</p>
        </div>
      </Card>
      <div className="mt-4 flex gap-4">
        <select onChange={(e) => setSelectedFilter(e.target.value)}>
          <option value="none">None</option>
          <option value="grayscale(100%)">Grayscale</option>
          <option value="sepia(100%)">Sepia</option>
          <option value="brightness(1.5)">Brightness</option>
        </select>
        <Button onClick={addText}>Add Text</Button>
      </div>
      <div ref={collageRef} className="mt-4 w-full h-96 border border-gray-400 relative">
        {images.map((image, index) => (
          <Rnd
            key={index}
            default={image.position}
            bounds="parent"
            enableResizing={true}
          >
            <Card className="relative w-full h-full">
              <CardContent className="p-0">
                <img
                  src={image.preview}
                  alt="Uploaded Preview"
                  className="w-full h-full object-cover rounded-lg"
                  style={{ filter: selectedFilter }}
                />
              </CardContent>
            </Card>
          </Rnd>
        ))}
        {texts.map((text, index) => (
          <Rnd
            key={index}
            default={{ x: text.x, y: text.y, width: 100, height: 50 }}
            bounds="parent"
            enableResizing={false}
          >
            {text.editing ? (
              <input
                type="text"
                className="bg-white p-2 border rounded shadow-lg w-full"
                value={text.text}
                onChange={(e) => handleTextChange(index, e)}
                onBlur={() => handleTextBlur(index)}
                autoFocus
              />
            ) : (
              <div
                className="bg-white p-2 text-black border rounded shadow-lg cursor-pointer"
                onClick={() => handleTextClick(index)}
              >
                {text.text}
              </div>
            )}
          </Rnd>
        ))}
      </div>
      <Button className="mt-4" onClick={exportCollage}>Download Collage</Button>
    </div>
  );
};

export default ImageCollageCreator;
