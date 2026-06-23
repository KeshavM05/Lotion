import { z } from 'zod';

/**
 * Environment variable validation schema.
 * The app will fail fast with a clear error message if required vars are missing.
 */
const envSchema = z.object({
  // Database (optional on Cloudflare Workers where Hyperdrive is used)
  DATABASE_URL: z.string().min(1).optional(),

  // AWS Bedrock (optional in dev — AI features won't work without these)
  AWS_REGION: z.string().min(1).default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // Google Calendar OAuth (optional in dev — calendar sync won't work without these)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z
    .string()
    .url('GOOGLE_REDIRECT_URI must be a valid URL')
    .default('http://localhost:3000/api/calendar/google/callback'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | undefined;

export const env: Env = new Proxy({} as Env, {
  get(_, prop: string) {
    if (!_env) {
      const parsed = envSchema.safeParse(process.env);
      if (!parsed.success) {
        const missing = parsed.error.issues
          .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
          .join('\n');
        throw new Error(
          `Missing or invalid environment variables:\n${missing}\n\n` +
            `Please check your .env.local file against .env.local.example.`
        );
      }
      _env = parsed.data;
    }
    return _env[prop as keyof Env];
  },
});
