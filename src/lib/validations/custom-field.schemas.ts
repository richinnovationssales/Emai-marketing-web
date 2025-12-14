import { z } from 'zod';
export const customFieldSchema = z.object({ name: z.string().min(1) });
