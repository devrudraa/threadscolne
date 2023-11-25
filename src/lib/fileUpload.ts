import { ChangeEvent } from "react";

export function handleFileUpload(
  e: ChangeEvent<HTMLInputElement>,
  fieldChange: (value: string) => void,
  setFiles: (value: File[]) => void
) {
  e.preventDefault();

  const fileReader = new FileReader();
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];

    setFiles(Array.from(e.target.files));

    if (!file.type.includes("image")) return;

    fileReader.onload = async (event) => {
      const imageDataUrl = event.target?.result?.toString() || "";
      fieldChange(imageDataUrl);
    };

    fileReader.readAsDataURL(file);
  }
}
