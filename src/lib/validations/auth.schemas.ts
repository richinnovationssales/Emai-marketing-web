import { z } from 'zod';

export const loginAdminSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    isSuperAdmin: z.boolean(),
});

export const loginUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerClientSchema = z.object({
    name: z.string().min(2, 'Client name must be at least 2 characters'),
    planId: z.string().min(1, 'Please select a plan'),
    adminUser: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
});

export type LoginAdminInput = z.infer<typeof loginAdminSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type RegisterClientInput = z.infer<typeof registerClientSchema>;
