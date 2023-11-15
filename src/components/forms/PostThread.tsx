"use client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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

interface PostThreadProps {
  userId: string;
}
const PostThread: FC<PostThreadProps> = ({ userId }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<ThreadType>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      accountId: "",
      thread: "",
    },
  });

  // 2. Define a.name
  async function onSubmit(values: ThreadType) {
    await CreateThread({
      authorId: userId,
      path: pathname,
      text: values.thread,
    });

    router.push("/");
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

        <Button type="submit" className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default PostThread;
