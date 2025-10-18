import { z } from "zod";

export const logInSchema = z.object ({
    email: z.email("Wrong E-mail Format"),
    password: z.string().min(6, "Password must be at least 6 characters long")
})

export const signUpSchema = z.object ({
        email: z.email("Wrong E-mail Format"),
        username: z.string().min(5, "Username must be at least 5 characters long"),
        password: z.string().min(6, "Password must be at least 6 characters long")
})


export const postSchema = z.object ({
        title: z.string().min(3, "Titles must have at least 3 characters"),
        content: z.string().optional(),
        images: z.instanceof(FormData).optional(),
})

export const commentSchema = z.object({
    post_id: z.number(),
    user_id: z.string(),
    content: z.string().min(1, "Comment content cannot be empty."),
});

export const editCommentSchema = z.object({
    comment_id: z.number(),
    content: z.string().min(1, "Comment content cannot be empty."),
});