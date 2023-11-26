import * as z from "zod";
import { isUsernameUnique } from "../actions/utils.actions";

export const UserValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 characters." }),
  username: z
    .string()
    .min(3)
    .max(10)
    .refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
      message: "Username can only contain letters, numbers, and underscores",
    })
    .refine(isUsernameUnique, {
      message: "Username is already taken",
    }),
  bio: z.string().max(1000, { message: "Maximum 1000 characters." }).optional(),
});

export type UserType = z.infer<typeof UserValidation>;
