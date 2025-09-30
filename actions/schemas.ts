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