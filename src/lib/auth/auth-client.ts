import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  //you can pass client configuration here
});

export const { signIn, signOut, signUp, useSession } = authClient;
