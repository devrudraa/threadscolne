import * as z from "zod";
import { isUsernameUnique } from "../actions/utils.actions";

export const UsernameValidator = z.object({
  username: z
    .string()
    .min(3)
    .max(10)
    .refine((value) => /^[a-zA-Z0-9_]+$/.test(value.trim()), {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  // .refine(isUsernameUnique, {
  //   message: "Username is already taken",
  // }),
});

export type UsernameType = z.infer<typeof UsernameValidator>;
