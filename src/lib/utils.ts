import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// generated by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// created by chatgpt
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

export function formatTimeAgo(localDate: string | Date): string {
  const date = new Date(localDate);
  const now = new Date();

  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}min ago`;
  } else {
    return `${seconds}s ago`;
  }
}

// created by chatgpt
export function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
}

interface dataURLtoFileProps {
  dataUrl: string;
  filename?: string;
  mimeType?: string;
  maxSizeInBytes?: number;
  resize?: boolean;
}
export async function dataURLtoFile({
  dataUrl,
  filename = "unnamed.webp",
  mimeType = "image/webp",
  maxSizeInBytes = 100 * 1024, // Default: 100kb
  resize = false,
}: dataURLtoFileProps) {
  if (resize) {
    return await resizingDataURLtoFile({
      dataUrl,
      filename,
      mimeType,
      maxSizeInBytes,
    });
  }
  // Extract base64 data
  const base64Data = dataUrl.split(",")[1];

  // Convert base64 to binary buffer
  const binaryData = atob(base64Data);

  // Create a Uint8Array to hold binary data
  const byteArray = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteArray[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([byteArray], { type: mimeType });

  // Create a File from the Blob
  const file = new File([blob], filename, { type: mimeType });

  return file;
}

interface ResizingDataURLtoFileProps {
  dataUrl: string;
  filename?: string;
  mimeType?: string;
  maxSizeInBytes?: number;
}

export async function resizingDataURLtoFile({
  dataUrl,
  filename = "resized.webp",
  mimeType = "image/webp",
  maxSizeInBytes = 100 * 1024, // Default: 100kb
}: ResizingDataURLtoFileProps) {
  // Extract base64 data
  const base64Data = dataUrl.split(",")[1];

  // Create an Image element
  const image = new Image();
  image.src = "data:image/jpeg;base64," + base64Data;

  // Wait for the image to load
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  // Create a canvas element
  const canvas = document.createElement("canvas");

  // Calculate the new dimensions to limit the image size to maxSizeInBytes
  let width = image.width;
  let height = image.height;
  let quality = 0.9; // Initial quality

  // Continue reducing quality and dimensions until the size is below the limit
  while (width * height * 0.75 > maxSizeInBytes && quality > 0.1) {
    width *= 0.9;
    height *= 0.9;
    quality -= 0.1;
  }

  // Set the canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw the image on the canvas with the calculated dimensions
  const context = canvas.getContext("2d");
  context?.drawImage(image, 0, 0, width, height);

  // Convert the canvas content to a Blob
  return new Promise<File>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Create a File from the Blob
          const file = new File([blob], filename, { type: mimeType });
          resolve(file);
        }
      },
      mimeType,
      quality
    );
  });
}

export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

export function stripEmptyHtmlTags(input: string): string {
  // Define the regular expression pattern to match any element with no content
  const regex = /<(\w+)(?:\s+[^>]*)?><\/\1>/g;
  // Replace occurrences of <element></element> with an empty string
  return input.replace(regex, "").trim();
  // Pass the filtered content to the onChange function
}
