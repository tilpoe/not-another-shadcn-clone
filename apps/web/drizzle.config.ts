import type { Config } from "drizzle-kit";
import { env } from "env";

export default {
  schema: "./src/server/db/main/schema",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
} satisfies Config;
