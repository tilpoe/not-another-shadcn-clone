import { createId } from "@paralleldrive/cuid2";
import { customType, varchar } from "drizzle-orm/mysql-core";

export const cuid = () => createId();
export const now = () => new Date();
export const uuid = () => crypto.randomUUID();

/**
 * This is the type that should be used as primary key for every table.
 */
export const primaryId = () =>
  varchar("id", { length: 128 }).primaryKey().$defaultFn(cuid);

export const ref = (name: string) => varchar(`${name}`, { length: 128 });

/**
 * Shorter alias for varchar.
 */
export const string = (name: string, length = 255) => {
  return varchar(name, { length });
};

/**
 * Stores UTC datetimes in MySQL and converts them to Date objects when reading from the database.
 */
export const datetimeUtc = (name: string, precision = 3) => {
  function mysqlDatetimeUtc(date: Date = new Date(), precision = 3) {
    const offset = precision > 0 ? 1 + precision : 0;

    return date
      .toISOString()
      .slice(0, 19 + offset)
      .replace("T", " ");
  }
  // Use this function instead of new Date() when converting a MySQL datetime to a
  // Date object so that the date is interpreted as UTC instead of local time (default behavior)
  function mysqlDatetimeUtcToDate(mysqlDatetimeUtc: string) {
    return new Date(mysqlDatetimeUtc.replace(" ", "T") + "Z");
  }

  return customType<{ data: Date; driverData: string }>({
    dataType() {
      return `datetime(${precision})`;
    },
    toDriver(value: Date): string {
      return mysqlDatetimeUtc(value, precision);
    },
    fromDriver(value: string): Date {
      return mysqlDatetimeUtcToDate(value);
    },
  })(name);
};
