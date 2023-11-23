"use client";
import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@nextui-org/react";
import { UsernameType, UsernameValidator } from "@/lib/validators/Username";
import { setUserUsername } from "@/lib/actions/utils.actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface ChooseUsernameProps {}
const ChooseUsernameForm: FC<ChooseUsernameProps> = ({}) => {
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const { data, status } = useSession();
  const form = useForm<UsernameType>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: "",
    },
  });

  if (status === "loading") {
    return <p>loading...</p>;
  }

  if (data?.user.username) {
    redirect("/");
  }

  async function checkUsername(e: UsernameType) {
    setIsCheckingUsername(true);
    const response = await setUserUsername({
      id: data?.user.id,
      username: e.username,
    });

    if (response) redirect("/");

    // Todo: Show a toast that the username didn't change because of some error
    setIsCheckingUsername(false);
  }

  return (
    <div className="min-w-[375px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(checkUsername)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Username" {...field} />
                </FormControl>
                <FormDescription>This is your unique name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            color="success"
            type="submit"
            disabled={isCheckingUsername}
            isLoading={isCheckingUsername}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default ChooseUsernameForm;
