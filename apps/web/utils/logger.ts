import chalk from "chalk";

export const logger = {
  error(...args: unknown[]) {
    console.info(chalk.red(...args));
  },
  warn(...args: unknown[]) {
    console.info(chalk.yellow(...args));
  },
  info(...args: unknown[]) {
    console.info(chalk.cyan(...args));
  },
  success(...args: unknown[]) {
    console.info(chalk.green(...args));
  },
  devOnly(...args: unknown[]) {
    if (process.env.NODE_ENV === "development") {
      console.info(chalk.magenta("> DEV-INFO:", ...args));
    }
  },
};
