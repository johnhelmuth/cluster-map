import {z} from "zod";

export const loginBodyZSchema = z.object({
  username: z.string()
    .min(5, 'Usernames must be at least 5 characters long.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Usernames must only use letters, numbers, underscore, or dashes.')
  ,
  password: z.string()
    .min(8, 'Password must be at least 8 characters long.')
    // bcryptjs will truncate at 72 bytes... support UTF-8, assume most characters won't take up more than 2 bytes.
    // there's another check in the code to see if the password string is too long.
    .max(36, 'Password must be at most 36 characters long.')
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
  return !! validateLoginBody(data);
}

export const registerBodyZSchema = z.object({
  name: z.string().min(3, 'Names must be at least 3 characters long.'),
  username: z.string()
    .min(5, 'Usernames must be at least 5 characters long.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Usernames must only use letters, numbers, underscore, or dashes.')
  ,
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  passwordConfirmed: z.string().min(8, 'Confirmation Password must be at least 8 characters long.'),
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
  return !! validateRegisterBody(data);
}

export const registerResponseZSchema = z.object({
  status: z.boolean(),
  message: z.string()
})

export type RegisterResponse = z.infer<typeof registerResponseZSchema>;
