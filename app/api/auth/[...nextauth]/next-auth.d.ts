// ./fe/types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      role?: string; // ✅ เพิ่ม role
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: number;
    username: string;
    role?: string;        // ✅ เพิ่ม role
    accessToken?: string; // ✅ ต้องตรงกับชื่อใน route.ts
  }
}
