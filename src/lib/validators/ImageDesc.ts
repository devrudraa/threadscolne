import * as z from "zod";

export const ImageDescValidator = z.object({
  desc: z.string().max(100).nullable(),
});

export type ImageDescValidatorType = z.infer<typeof ImageDescValidator>;
