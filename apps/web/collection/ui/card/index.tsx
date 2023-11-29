import React from "react";
import { cva } from "cva";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const cardVariants = {
  root: cva({
    base: "flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm",
  }),
  header: cva({
    base: "grid grid-cols-[1fr_auto] gap-4 p-6 sm:gap-8",
  }),
  heading: cva({
    base: "flex items-center gap-3 sm:flex-col sm:items-start sm:justify-center sm:gap-2",
  }),
  actions: cva({
    base: "flex items-center gap-2",
  }),
  title: cva({
    base: "text-xl font-semibold leading-none tracking-tight",
  }),
  description: cva({
    base: "text-sm text-muted-foreground",
  }),
  content: cva({
    base: "p-6 pt-0",
  }),
  footer: cva({
    base: "flex items-center p-6 pt-0",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export type CardProps = React.ComponentPropsWithRef<"div">;

export const Card = autoRef(({ className, ...props }: CardProps) => {
  return <div className={cn(cardVariants.root(), className)} {...props} />;
});

/* --------------------------------- Header --------------------------------- */

export type CardHeaderProps = React.ComponentPropsWithRef<"div">;

export const CardHeader = autoRef(
  ({ className, ...props }: CardHeaderProps) => {
    return <div className={cn(cardVariants.header(), className)} {...props} />;
  },
);

/* --------------------------------- Heading -------------------------------- */

export type CardHeadingProps = React.ComponentPropsWithRef<"div">;

export const CardHeading = autoRef(
  ({ className, ...props }: CardHeadingProps) => {
    return <div className={cn(cardVariants.heading(), className)} {...props} />;
  },
);

/* --------------------------------- Actions -------------------------------- */

export type CardActionsProps = React.ComponentPropsWithRef<"div">;

export const CardActions = autoRef(
  ({ className, ...props }: CardActionsProps) => {
    return <div className={cn(cardVariants.actions(), className)} {...props} />;
  },
);

/* ---------------------------------- Title --------------------------------- */

export type CardTitleProps = React.ComponentPropsWithRef<"h3">;

export const CardTitle = autoRef(({ className, ...props }: CardTitleProps) => {
  return <h3 className={cn(cardVariants.title(), className)} {...props} />;
});

/* ------------------------------- Description ------------------------------ */

export type CardDescriptionProps = React.ComponentPropsWithRef<"p">;

export const CardDescription = autoRef(
  ({ className, ...props }: CardDescriptionProps) => {
    return (
      <p className={cn(cardVariants.description(), className)} {...props} />
    );
  },
);

/* --------------------------------- Content -------------------------------- */

export type CardContentProps = React.ComponentPropsWithRef<"div">;

export const CardContent = autoRef(
  ({ className, ...props }: CardContentProps) => {
    return <div className={cn(cardVariants.content(), className)} {...props} />;
  },
);

/* --------------------------------- Footer --------------------------------- */

export type CardFooterProps = React.ComponentPropsWithRef<"div">;

export const CardFooter = autoRef(
  ({ className, ...props }: CardFooterProps) => {
    return <div className={cn(cardVariants.footer(), className)} {...props} />;
  },
);
