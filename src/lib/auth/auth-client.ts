import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  //you can pass client configuration here
});

export const { signIn, signOut, signUp, useSession } = authClient;
