"use client";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { ThreadType, ThreadValidation } from "@/lib/validators/Thread";
import { CreateThread } from "@/lib/actions/threads.actions";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

interface PostThreadProps {}
const PostThread: FC<PostThreadProps> = () => {
  const { data, status } = useSession();
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
  if (status === "unauthenticated") return null;

  // 2. Define a.name
  async function onSubmit(values: ThreadType) {
    if (status !== "loading" && data) {
      SetIsSubmitting(true);
      await CreateThread({
        authorId: data.user.id,
        path: pathname,
        text: values.thread,
      });
      router.push("/");
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
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1  ">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isLoading={isSubmitting}
          disabled={status === "loading" || isSubmitting}
          type="submit"
          className="bg-primary-500"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default PostThread;
