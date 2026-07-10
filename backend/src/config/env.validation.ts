import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.string().url().default("http://localhost:3000"),
  API_URL: z.string().url().default("http://localhost:4000"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url().optional(),
  JWT_ISSUER: z.string().min(1).optional(),
  JWT_AUDIENCE: z.string().min(1).optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  CLERK_JWT_KEY: z.string().min(1).optional(),
  CLERK_AUTHORIZED_PARTIES: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_CONNECT_CLIENT_ID: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).optional(),
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  FIREBASE_CLIENT_EMAIL: z.string().min(1).optional(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
});

export type Environment = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Environment {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${formattedErrors}`);
  }

  return result.data;
}
