import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface User {
  id: number;
  username: string;
  accessToken: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://localhost:3001/auth/login", {
            username: credentials?.username,
            password: credentials?.password,
          });

          if (res.data.success) {
            return {
              id: res.data.user.id,
              username: res.data.user.username,
              accessToken: res.data.access_token,
            } as User;
          }

          return null;
        } catch (error: any) {
          console.error("Authorize error:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, // ต้องมี
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = String(user.id);
        token.username = user.username;
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: Number(token.sub),
        username: token.username as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
