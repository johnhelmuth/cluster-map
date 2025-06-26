import {z} from "zod";

export const loginBodyZSchema = z.object({
  username: z.string()
    .min(5, 'Usernames must be at least 5 characters long.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Usernames must only use letters, numbers, underscore, or dashes.')
  ,
  password: z.string().min(8, 'Password must be at least 8 characters long.')
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