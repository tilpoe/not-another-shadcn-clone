import { redirect } from "next/navigation";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { env } from "env";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JwtUser, UserToAuthenticate } from "server/auth/shared";
import { getJwtDataFromUser, jwtUserSchema } from "server/auth/shared";
import { db } from "server/db";
import { tUserAccounts } from "server/db/schema";
import { z } from "zod";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: JwtUser & DefaultSession["user"];
  }

  interface User {
    user: JwtUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: JwtUser;
  }
}

export async function getUsers(email?: string) {
  let query = db.select().from(tUserAccounts).$dynamic();

  if (email) {
    query = query.where(eq(tUserAccounts.email, email));
  }

  const rows = await query;

  if (email && rows.length === 0) {
    return null;
  }

  const result = rows.reduce<Record<string, UserToAuthenticate>>((acc, row) => {
    const account = row;

    if (!acc[account.id]) {
      acc[account.id] = {
        account,
      };
    }

    return acc;
  }, {});

  if (email && Object.keys(result).length !== 1) {
    throw new Error(
      `Expected exactly one user, but got ${Object.keys(result).length}`,
    );
  }

  return Object.values(result);
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: token.user,
    }),
    jwt({ token, user, trigger, session }) {
      // we have to validate the data if it's updated
      if (trigger === "update") {
        const parsedSession = z
          .object({
            id: z.string(),
            user: jwtUserSchema,
          })
          .safeParse(session);

        if (!parsedSession.success) {
          throw new Error(
            `Parsing of the updated session data failed: ${JSON.stringify(
              parsedSession.error,
            )}`,
          );
        }

        token.user = parsedSession.data.user;
        return token;
      }

      if (user) {
        token.user = user.user;
      }

      return token;
    },
  },
  // @ts-expect-error the error occurs, because the override of the "User" type leads to a type mismatch for the AdapterUser
  // but because we only use jwt that shouldn't be a problem, but maybe we should fix it in the future
  adapter: DrizzleAdapter(db, mysqlTable),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-Mail Adresse", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const users = await getUsers(credentials.email);
        const user = users?.[0];

        if (!user) {
          return null;
        }

        // check if password is correct if user was found
        const passwordVerified = await bcrypt.compare(
          credentials.password,
          user.account.password,
        );
        if (passwordVerified === true) {
          return getJwtDataFromUser(user);
        }

        return null;
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getSession = () => getServerSession(authOptions);

export function denyAccess(): never {
  redirect("/login");
}

/**
 * Authenticates a request made by a cronjob by checking the authorization token against a stored API key.
 *
 * @param request - The request object to authenticate.
 * @returns A Promise that resolves to a boolean indicating whether the request is authenticated.
 */
export function authenticateCronjobRequest(request: Request) {
  if (env.NODE_ENV !== "production") {
    return true;
  }

  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return false;
  }

  /*   const apiKey = await db.query.security_cronApiKey.findFirst({
    where: (row, { eq }) => eq(row.prefix, token.split(".")[0] ?? ""),
  });

  if (!apiKey || (await bcrypt.compare(token, apiKey.key)) !== true) {
    return false;
  } 
  
  return true;
  */

  return false;
}
