import { z } from 'zod';

export const contactSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    customFieldValues: z.record(z.any()).optional(),
});

export const updateContactSchema = contactSchema.partial();

export type ContactInput = z.infer<typeof contactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
