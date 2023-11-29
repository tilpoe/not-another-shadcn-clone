import type { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "env.js";
import mysql from "mysql2";
import { logger } from "utils/logger";

import * as schema from "./schema";

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    logger.warn(
      `-------------------- QUERY: INTERNAL ${Math.floor(
        Math.random() * Math.floor(1000) - Math.floor(1) + Math.floor(1),
      )} --------------------`,
    );
    console.info("- query:");
    console.info(query);
    console.info("- params:");
    console.info(params);
    logger.warn("---");
  }
}

const register = <T>(initFn: () => T): T => {
  if (process.env.NODE_ENV === "development") {
    if (!("db" in global)) {
      // @ts-expect-error will be correct
      global.db = initFn();
    }
    // @ts-expect-error will be correct
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return global.db;
  }
  return initFn();
};

export const db = register(() => {
  return drizzle(mysql.createPool(env.DATABASE_URL), {
    schema,
    mode: "default",
    logger: env.NODE_ENV === "development" ? new CustomLogger() : false,
  });
});
