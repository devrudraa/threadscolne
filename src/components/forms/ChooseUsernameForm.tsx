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
import { useRouter } from "next/navigation";

interface ChooseUsernameProps {}
const ChooseUsernameForm: FC<ChooseUsernameProps> = ({}) => {
  const router = useRouter();
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const { data, status } = useSession();
  const form = useForm<UsernameType>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: "",
    },
  });

  // if (status === "loading") {
  //   return <p>loading...</p>;
  // }

  if (data?.user.username) {
    router.replace("/");
  }

  async function checkUsername(e: UsernameType) {
    if (status !== "loading") {
      setIsCheckingUsername(true);

      const response = await setUserUsername({
        id: data?.user.id,
        username: e.username,
      });
      // console.log("response", response);

      if (response) router.replace("/");

      // Todo: Show a toast that the username didn't change because of some error
      setIsCheckingUsername(false);
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(checkUsername)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    size="sm"
                    autoComplete="off"
                    label="Username"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your unique name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            color="success"
            type="submit"
            disabled={isCheckingUsername || status === "loading"}
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
