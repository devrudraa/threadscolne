import { FC } from "react";
import React from "react";
import { Button } from "@nextui-org/react";
import { X } from "lucide-react";
import { Image } from "@nextui-org/react";
import { removeImgSrc } from "@/lib/Store/features/textEditor/editorSlice";
import { useDispatch } from "react-redux";
import ImageAltTextForm from "../forms/ImageAltTextForm";

interface ShowImageInTextEditorProps {
  imageUrl: string | null;
}
const ShowImageInTextEditor: FC<ShowImageInTextEditorProps> = ({
  imageUrl,
}) => {
  const dispatch = useDispatch();
  function removeImageFromStore(): void {
    dispatch(removeImgSrc());
  }

  return (
    <div className="relative w-fit aspect-video mx-auto pb-5">
      <ImageAltTextForm />

      <Button
        size="sm"
        isIconOnly
        variant="flat"
        className="absolute top-2 right-2 z-20"
        onClick={removeImageFromStore}
      >
        <X size={"14"} />
      </Button>

      <Image
        src={imageUrl ? imageUrl : "/images.jpg"}
        className="object-contain rounded-xl"
        width={400}
        height={400}
        alt="someMage"
      />
    </div>
  );
};
export default ShowImageInTextEditor;
