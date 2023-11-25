"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserType, UserValidation } from "@/lib/validators/user";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUserData } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface EditProfileModalProps {
  id: string;
  image: string;
  name: string;
  bio: string | null;
  username: string | undefined;
}

export default function EditProfileModal({
  bio,
  id,
  image,
  name,
  username,
}: EditProfileModalProps) {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();

  const form = useForm<UserType>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      image: image || "",
      name: name || "",
      username: username || "",
      bio: bio || "",
    },
  });

  // 2. Define a.name
  async function onSubmit(values: UserType) {
    // const blob = values.image;
    // const hasImageChanged = isBase64Image(blob!);
    // if (hasImageChanged) {
    //   const imgRes = await startUpload(files);
    //   if (imgRes && imgRes[0].url) {
    //     values.image = imgRes[0].url;
    //   }
    // }
    const response = await updateUserData({
      id: id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      path: pathname,
    });

    if (response) {
      router.refresh();
      console.log("done");
    }
  }

  return (
    <>
      <Button variant="bordered" className="rounded-full" onPress={onOpen}>
        Edit Profile
      </Button>
      <Modal
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody className="mb-10">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col justify-start gap-10"
                  >
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <FormLabel className="account-form_image-label">
                            {field.value ? (
                              <Image
                                src={field.value}
                                alt="profile_icon"
                                width={96}
                                height={96}
                                priority
                                className="rounded-full object-contain"
                              />
                            ) : (
                              <Image
                                src="/assets/profile.svg"
                                alt="profile_icon"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            )}
                          </FormLabel>
                          <FormControl className="flex-1 text-base-semibold text-gray-200">
                            <Input
                              size="sm"
                              type="file"
                              accept="image/*"
                              placeholder="Add profile photo"
                              className="account-form_image-input"
                              // onChange={(e) => {
                              //   handleFileUpload(e, field.onChange, setFiles);
                              //   console.log(field);
                              // }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-base-semibold text-light-2">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input size="sm" className="no-focus" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <FormLabel className="text-base-semibold text-light-2">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input {...field} size="sm" className="no-focus" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-base-semibold text-light-2">
                            Bio
                          </FormLabel>
                          <FormControl>
                            <Textarea className="no-focus" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="bg-primary-500">
                      Submit
                    </Button>
                  </form>
                </Form>
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
