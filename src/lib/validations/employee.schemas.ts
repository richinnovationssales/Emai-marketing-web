import { z } from 'zod';
export const employeeSchema = z.object({ email: z.string().email() });
