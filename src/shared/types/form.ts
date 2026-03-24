import { z } from 'zod';

export type InferForm<T extends z.ZodTypeAny> = [z.input<T>, z.output<T>];
