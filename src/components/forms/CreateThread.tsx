"use client";
import { FC, useState } from "react";
import dynamic from "next/dynamic";
const TipTapEditor = dynamic(() => import("../Editor/TipTapEditor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadType, ThreadValidation } from "@/lib/validators/Thread";
import { Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AddThread } from "@/lib/actions/threads.actions";
import { RootState } from "@/lib/Store/Store";
import { useSelector } from "react-redux";
import { dataURLtoFile, isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface CreateThreadProps {
  authorId: string;
}
const CreateThread: FC<CreateThreadProps> = ({ authorId }) => {
  const [isSubmitting, SetIsSubmitting] = useState<boolean>(false);
  const { desc, src } = useSelector((state: RootState) => state);
  const pathname = usePathname();
  const router = useRouter();
  const { startUpload } = useUploadThing("uploadImage");

  const form = useForm<ThreadType>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      accountId: "",
      thread: "",
    },
  });

  async function onSubmit(values: ThreadType) {
    SetIsSubmitting(true);
    if (values.thread.length <= 0) {
      form.setError("thread", { message: "Thread can't be empty!" });
      SetIsSubmitting(false);
      return;
    }
    try {
      let imageFileSrc = undefined;
      let imageDesc = undefined;
      if (src) {
        // Todo:  Add toast notification
        if (!isBase64Image(src)) return;
        const imageFileToUpload = await dataURLtoFile({
          dataUrl: src,
          resize: true,
        });

        const imgRes = await startUpload([imageFileToUpload]);

        if (!imgRes) return false;
        imageFileSrc = imgRes[0].url;
        if (desc) imageDesc = desc;
      }
      await AddThread({
        authorId: authorId,
        path: pathname,
        text: values.thread,
        desc: imageDesc,
        image: imageFileSrc,
      }).then(() => {
        router.push("/");
        SetIsSubmitting(false);
      });
    } catch (error) {
      window.alert("Something went wrong!!");
      SetIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <TipTapEditor onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting}
          type="submit"
          className="bg-primary-500"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default CreateThread;
