import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().min(1, { message: "Thread can't be empty" }),
  accountId: z.string(),
});

export type ThreadType = z.infer<typeof ThreadValidation>;

export const CommentValidation = z.object({
  thread: z.string().min(3, { message: "Minimum 3 characters." }),
});

export type CommentType = z.infer<typeof CommentValidation>;
