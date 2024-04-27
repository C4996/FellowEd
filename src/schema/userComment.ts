import { z } from 'zod';


export const selectedContent = z.object({
    fileId: z.string().uuid(),
    offset: z.number().min(0, { message: "offset should be greater than or equal to 0" }),
    length: z.number().min(1, { message: "length should be greater than 0" }),
    userId: z.string().uuid()
});

export type SelectedContent = z.infer<typeof selectedContent>;

export const userComment = z.object({
    userId: z.string().uuid(),
    comment: z.string(),
    fileId: z.string().uuid(),
    selected: selectedContent,
    createdAt: z.string().datetime(),
});

export type UserComment = z.infer<typeof userComment>;

