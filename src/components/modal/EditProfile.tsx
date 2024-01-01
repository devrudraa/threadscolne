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
  Skeleton,
} from "@nextui-org/react";
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

import { updateUserData } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ChooseUploadImage = dynamic(() => import("../shared/ChooseUploadImage"), {
  loading: () => (
    <Skeleton className="w-10 h-10 rounded-full aspect-square  mx-auto" />
  ),
});

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
  const router = useRouter();

  const form = useForm<UserType>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: name || "",
      username: username || "",
      bio: bio || "",
    },
  });

  // 2. Define a.name
  async function onSubmit(values: UserType) {
    const response = await updateUserData({
      id: id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      path: pathname,
    });

    if (response) {
      router.refresh();
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody className="mb-10">
                <ChooseUploadImage id={id} image={image} />

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col justify-start gap-10"
                  >
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
