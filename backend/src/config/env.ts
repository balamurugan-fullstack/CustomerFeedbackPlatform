import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1).default('mongodb+srv://Baladev:SuperSecure123!@balanode.ozd5tum.mongodb.net/?appName=BalaNode'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  JWT_SECRET: z.string().min(1).default('development-secret'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  ADMIN_EMAIL: z.string().email().default('admin@gmail.com'),
  ADMIN_PASSWORD: z.string().min(8).default('ChangeMe123!'),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  console.error('Invalid environment variables:', formatted);
  process.exit(1);
}

export const env = parsed.data;
