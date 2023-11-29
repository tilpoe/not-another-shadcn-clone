import { mysqlTable } from "drizzle-orm/mysql-core";
import { primaryId, string } from "server/db/types";

/* -------------------------------------------------------------------------- */
/*                                 UserAccount                                */
/* -------------------------------------------------------------------------- */

export const tUserAccounts = mysqlTable("UserAccount", {
  id: primaryId(),
  email: string("email").notNull(),
  password: string("password").notNull(),
});

export type TUserAccount = typeof tUserAccounts.$inferSelect;
