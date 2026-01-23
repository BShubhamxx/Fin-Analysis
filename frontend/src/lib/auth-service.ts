
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    UserCredential
} from "firebase/auth";
import { auth } from "./firebase";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const AuthService = {
    login: async (data: LoginFormData): Promise<UserCredential> => {
        return await signInWithEmailAndPassword(auth, data.email, data.password);
    },

    signup: async (data: SignupFormData): Promise<UserCredential> => {
        return await createUserWithEmailAndPassword(auth, data.email, data.password);
    },

    logout: async (): Promise<void> => {
        return await signOut(auth);
    },

    resetPassword: async (email: string): Promise<void> => {
        return await sendPasswordResetEmail(auth, email);
    }
};
