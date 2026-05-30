import { z } from 'zod';
import { config } from 'dotenv';


config();
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().min(1)
});
export const env = envSchema.parse(process.env);