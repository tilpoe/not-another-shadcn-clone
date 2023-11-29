import type { TUserAccount } from "server/db/schema";
import { z } from "zod";

export interface UserToAuthenticate {
  account: TUserAccount;
}

export const jwtUserSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export type JwtUser = z.infer<typeof jwtUserSchema>;

/**
 * If null is returned, the user is either undefined or has an invalid config
 */
export function getJwtDataFromUser(user: UserToAuthenticate): {
  id: "";
  user: z.infer<typeof jwtUserSchema>;
} | null {
  return {
    id: "",
    user: {
      id: user.account.id,
      email: user.account.email,
    },
  };
}
