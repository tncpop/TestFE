// ./fe/types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: number;
    username: string;
    access_token?: string;
  }
}
