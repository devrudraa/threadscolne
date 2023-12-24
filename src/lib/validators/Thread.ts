import { maxLengthForThread } from "@/Constants";
import * as z from "zod";
import { stripHtmlTags } from "../utils";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .refine((value) => stripHtmlTags(value).length >= 3, {
      message: "Thread must have at least 3 characters",
    })
    .refine((value) => stripHtmlTags(value).length <= maxLengthForThread, {
      message: `Thread can't exceed ${maxLengthForThread} characters`,
    }),
  accountId: z.string(),
});

export type ThreadType = z.infer<typeof ThreadValidation>;

export const CommentValidation = z.object({
  thread: z.string().min(3, { message: "Minimum 3 characters." }).max(100),
});

export type CommentType = z.infer<typeof CommentValidation>;
