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
import { isUsernameUnique, setUserUsername } from "@/lib/actions/utils.actions";
import { useRouter } from "next/navigation";
import { UpdateSession } from "@/types/next-auth";

interface ChooseUsernameProps {
  userId: string;
  update: UpdateSession;
}
const ChooseUsernameForm: FC<ChooseUsernameProps> = ({ userId, update }) => {
  const router = useRouter();
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

  const form = useForm<UsernameType>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: "",
    },
  });

  async function checkUsername(e: UsernameType) {
    try {
      setIsCheckingUsername(true);

      //* Before setting the username we have to check if it is unique or not
      const isUsernameUniqueResponse = await isUsernameUnique(e.username);

      if (!isUsernameUniqueResponse)
        form.setError("username", {
          message: "username is already taken please choose another username",
        });

      const response = await setUserUsername({
        id: userId,
        username: e.username,
      });

      // Assuming response is an object with a success property indicating success or failure
      if (response) {
        //* This update function is for refreshing the jwt token.
        update();
        router.refresh();
        // router.replace("/");
      } else {
        // Todo: Show a toast that the username didn't change because of some error
        console.error("Username change failed");
      }
    } catch (error) {
      console.error("Error during username change:", error);
    } finally {
      setIsCheckingUsername(false);
    }
  }

  return (
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
          disabled={isCheckingUsername}
          isLoading={isCheckingUsername}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default ChooseUsernameForm;
