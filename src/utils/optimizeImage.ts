import imageCompression from "browser-image-compression";

type ImageOptions = {
  maxSizeMB: number;
  maxWidthOrHeight: number;
};

// Optimize image for webp format and return a new File object

export const optimizeImage = async (
  file: File,
  options: ImageOptions,
): Promise<File> => {
  const compressedFile = await imageCompression(file, {
    ...options,
    useWebWorker: true,
    fileType: "image/webp",
  });

  return new File(
    [compressedFile],
    file.name.replace(/\.[^.]+$/, ".webp"),
    {
      type: "image/webp",
      lastModified: Date.now(),
    },
  );
};

export const optimizeAvatar = (file: File) =>
  optimizeImage(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 500,
  });

export const optimizeLargeImage = (file: File) =>
  optimizeImage(file, {
    maxSizeMB: 10,
    maxWidthOrHeight: 4096,
  });