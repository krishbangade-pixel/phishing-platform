import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  SUPABASE_URL: z.string().url().or(z.string().default('https://placeholder-project.supabase.co')),
  SUPABASE_ANON_KEY: z.string().default('placeholder-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder-service-role-key'),

  GOOGLE_SAFE_BROWSING_API_KEY: z.string().optional().default(''),
  GOOGLE_SAFE_BROWSING_ENABLED: z.coerce.boolean().default(false),

  VIRUSTOTAL_API_KEY: z.string().optional().default(''),
  VIRUSTOTAL_ENABLED: z.coerce.boolean().default(false),

  CORS_ORIGIN: z.string().default('*'),

  MAX_URL_LENGTH: z.coerce.number().default(2048),
  MAX_EMAIL_LENGTH: z.coerce.number().default(20000),
  MAX_MESSAGE_LENGTH: z.coerce.number().default(10000),

  URL_SCAN_RATE_LIMIT: z.coerce.number().default(20),
  EMAIL_SCAN_RATE_LIMIT: z.coerce.number().default(10)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid Environment Configuration:', parsedEnv.error.format());
}

export const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});
