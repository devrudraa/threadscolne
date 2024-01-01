"use client";
import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import { ChangeEvent, FC, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { uploadUserProfilePic } from "@/lib/actions/uploadthing.action";
import { useUploadThing } from "@/lib/uploadthing";
import { dataURLtoFile } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ChooseUploadImageProps {
  id: string;
  image: string;
}
const ChooseUploadImage: FC<ChooseUploadImageProps> = ({ image, id }) => {
  const router = useRouter();
  const imageInpRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { startUpload } = useUploadThing("uploadImage");

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) {
        // Todo: Add Toast error notification
        console.log("please select image only");
        return;
      }

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setImageSrc(imageDataUrl);
        onOpen();
      };
      fileReader.readAsDataURL(file);
    }
  }

  const onCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      try {
        const image = new window.Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.classList.add("hidden");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            const targetSize = 150; // Set the desired size

            canvas.width = targetSize;
            canvas.height = targetSize;

            ctx.drawImage(
              image,
              croppedAreaPixels.x,
              croppedAreaPixels.y,
              croppedAreaPixels.width,
              croppedAreaPixels.height,
              0,
              0,
              targetSize,
              targetSize
            );

            const dataUrl = canvas.toDataURL("image/jpeg");
            setCroppedImage(dataUrl);
          }
        };

        image.src = imageSrc || "";
      } catch (error) {
        console.error("Error processing cropped image:", error);
      }
    },
    [imageSrc]
  );

  async function uploadImage() {
    if (!croppedImage) return;

    setIsImageUploading(true);
    const fileToUpload = await dataURLtoFile({
      dataUrl: croppedImage,
      filename: `${id}.webp`,
    });
    const imgRes = await startUpload([fileToUpload]);
    if (imgRes && imgRes.length > 0) {
      const response = await uploadUserProfilePic({
        id: id,
        image: imgRes[0].url,
      });
      setIsImageUploading(false);
      if (!response) {
        console.error("Image upload failed");
        return;
      }
      onClose();
      router.refresh();
    }
  }

  return (
    <>
      <input
        ref={imageInpRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFileSelect(e)}
      />
      <div className="flex items-center gap-4 ">
        <div className="mx-auto relative overflow-hidden rounded-full cursor-pointer">
          <button
            onClick={() => {
              if (imageInpRef.current) imageInpRef.current.click();
            }}
            className="absolute top-0 right-0 w-full h-full bg-gray-900/10 grid place-items-center"
          >
            <Image
              src={"/assets/edit.svg"}
              width={24}
              height={24}
              alt="edit svg"
            />
          </button>
          <Image
            src={image}
            alt="profile_icon"
            width={80}
            height={80}
            className="object-contain mx-auto"
          />
        </div>
      </div>

      {/* <Button onPress={onOpen}>Open Modal</Button> */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Media
              </ModalHeader>
              <ModalBody className="relative max-w-full min-h-[25rem] grid place-items-center">
                {isImageUploading ? (
                  <div className="text-center">
                    <Spinner />
                    <br />
                    <label
                      className="text-small-semibold text-gray-400"
                      htmlFor="spinner"
                    >
                      Uploading Image...
                    </label>
                  </div>
                ) : (
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onPress={uploadImage}
                  disabled={isImageUploading}
                  isLoading={isImageUploading}
                >
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ChooseUploadImage;
