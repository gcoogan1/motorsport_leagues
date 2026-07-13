import imageCompression from "browser-image-compression";

export const optimizeImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 500,
    useWebWorker: true,
    fileType: "image/webp",
  };

  const compressedFile = await imageCompression(file, options);

  return new File(
    [compressedFile],
    file.name.replace(/\.[^.]+$/, ".webp"),
    {
      type: "image/webp",
      lastModified: Date.now(),
    }
  );
};