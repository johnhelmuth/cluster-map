import {z} from "zod";

const usernameZSchema = z.string()
    .min(5, 'Usernames must be at least 5 characters long.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Usernames must only use letters, numbers, underscore, or dashes.');
const emailZSchema = z.string().email();

export type EmailType = typeof emailZSchema;

export const loginBodyZSchema = z.object({
  usernameOrEmail: usernameZSchema.or(emailZSchema),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long.')
    // bcryptjs will truncate at 72 bytes... support UTF-8, assume most characters won't take up more than 2 bytes.
    // there's another check in the code to see if the password string is too long.
    .max(36, 'Password must be at most 36 characters long.'),
  isEmail: z.boolean().optional(),
})
  .transform(data => {
    data.isEmail = isEmail(data.usernameOrEmail);
    return data;
  });

export type LoginDocument = z.infer<typeof loginBodyZSchema>;

export function validateLoginBody(data: any) {
  const loginBody = parseLoginBody(data);
  if (loginBody.success) {
    return loginBody.data
  }
  return false;
}

export function parseLoginBody(data: any) {
  return loginBodyZSchema.safeParse(data);
}

export function isLoginDocument(data: any): data is LoginDocument {
  return !!validateLoginBody(data);
}

export function validateEmail(data: any) {
  const email = parseEmail(data);
  if (email.success) {
    return email.data;
  }
  return false;
}

export function isEmail(data: any): data is EmailType {
  return !!validateEmail(data);
}

export function parseEmail(data: any) {
  return emailZSchema.safeParse(data);
}

export function emailToUsername(email: string): string {
  const emailSegments = email.split('@');
  return emailSegments[0] || 'unknown-username';
}

export const registerBodyZSchema = z.object({
  name: z.string().min(3, 'Names must be at least 3 characters long.'),
  username: usernameZSchema
    .optional(),
  email: emailZSchema,
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  passwordConfirmed: z.string().min(8, 'Confirmation Password must be at least 8 characters long.'),
})
  .transform((data, ctx) => {
    if (!data?.username) {
      if (! isEmail(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: 'Unexpectedly invalid email.'
        });
        return z.NEVER;
      }
      data.username = emailToUsername(data.email);
    }
    return data;
  })
  .refine((data) => data.password === data.passwordConfirmed, {
    message: "Passwords don't match",
    path: ["passwordConfirmed"], // path of error
  });

export type RegisterDocument = z.infer<typeof registerBodyZSchema>;

export function validateRegisterBody(data: any) {
  const registerBody = parseRegisterBody(data);
  if (registerBody.success) {
    return registerBody.data
  }
  return false;
}

export function parseRegisterBody(data: any) {
  return registerBodyZSchema.safeParse(data);
}

export function isRegisterDocument(data: any): data is RegisterDocument {
  return !!validateRegisterBody(data);
}

export const registerResponseZSchema = z.object({
  status: z.boolean(),
  message: z.string()
})

export type RegisterResponse = z.infer<typeof registerResponseZSchema>;
