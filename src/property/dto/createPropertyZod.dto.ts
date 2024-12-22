import { z } from 'zod';

export const createPropertySchema = z
  .object({
    name: z.string(),
    description: z.string().min(3, { message: 'kiedys zaczne to robic' }),
    area: z.number().positive(),
  })
  .required();

export type CreatePropertyZodDto = z.infer<typeof createPropertySchema>;
