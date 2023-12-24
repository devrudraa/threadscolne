"use client";
import { FC, useState } from "react";
import dynamic from "next/dynamic";
const TipTap = dynamic(() => import("../Editor/TipTap"), {
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

interface CreateThreadProps {
  authorId: string;
}
const CreateThread: FC<CreateThreadProps> = ({ authorId }) => {
  const [isSubmitting, SetIsSubmitting] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<ThreadType>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      accountId: "",
      thread: "",
    },
  });

  async function onSubmit(values: ThreadType) {
    SetIsSubmitting(true);
    console.log(values.thread.length);
    console.log(values.thread);
    if (values.thread.length <= 0) {
      form.setError("thread", { message: "Thread can't be empty!" });
      SetIsSubmitting(false);
      window.alert("Something went wrong!!");
      return;
    }

    try {
      await AddThread({
        authorId: authorId,
        path: pathname,
        text: values.thread,
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
                <TipTap description={field.name} onChange={field.onChange} />
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
