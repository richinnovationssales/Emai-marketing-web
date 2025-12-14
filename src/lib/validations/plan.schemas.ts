import { z } from 'zod';
export const planSchema = z.object({ name: z.string().min(1) });
