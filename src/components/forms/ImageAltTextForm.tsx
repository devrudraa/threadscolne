import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Type } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImageDescValidator,
  ImageDescValidatorType,
} from "@/lib/validators/ImageDesc";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/Store/Store";
import { updateImgDesc } from "@/lib/Store/features/textEditor/editorSlice";

const ImageAltTextForm = () => {
  //! In this component I used `onSubmit({ desc: form.getValues("desc") })` this code to submit the form it is because this
  //! component is a part of the component that is TipTap and in that component there is a form too while submitting this form that
  //! TipTap form was also getting submitted to prevent that I used this approach

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const desc = useSelector((state: RootState) => state.desc);

  const form = useForm<ImageDescValidatorType>({
    resolver: zodResolver(ImageDescValidator),
  });

  function onSubmit(values: ImageDescValidatorType) {
    let descValue = values.desc;
    if (values.desc === "") descValue = null;
    dispatch(updateImgDesc(descValue));
    onClose();
  }

  return (
    <>
      <Button
        size="sm"
        isIconOnly
        variant="flat"
        className="absolute top-2 left-2 z-20"
        onClick={() => {
          form.setValue("desc", desc ? desc : "");
          onOpen();
        }}
      >
        <Type size={"14"} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add description of the image.
              </ModalHeader>
              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="desc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            {/* @ts-ignore */}
                            <Input
                              isClearable
                              autoComplete="off"
                              onClear={() => {
                                dispatch(updateImgDesc(null));
                                form.setValue("desc", "");
                              }}
                              size="sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  onSubmit({ desc: form.getValues("desc") });
                                  e.preventDefault();
                                }
                              }}
                              placeholder="This is a abstract art..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This describes your photos so they&apos;re
                            accessible to even more people, including people who
                            are blind or have low vision
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ModalFooter>
                      <Button
                        color="danger"
                        type="button"
                        variant="light"
                        onPress={onClose}
                      >
                        Close
                      </Button>
                      <Button
                        type="button"
                        onClick={() =>
                          onSubmit({ desc: form.getValues("desc") })
                        }
                        color="primary"
                      >
                        Done
                      </Button>
                    </ModalFooter>
                  </form>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ImageAltTextForm;
