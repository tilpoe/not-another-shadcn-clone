import { autoRef, cn } from "@/lib/ui";

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */
export type CardProps = React.ComponentPropsWithRef<"div">;

export const Card = autoRef(({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/*                                   Header                                   */
/* -------------------------------------------------------------------------- */
export type CardHeaderProps = React.ComponentPropsWithRef<"div">;

export const CardHeader = autoRef(
  ({ className, ...props }: CardHeaderProps) => {
    return (
      <div
        className={cn(
          "grid shrink-0 grid-cols-[1fr_auto] gap-4 p-6 sm:gap-8",
          className,
        )}
        {...props}
      />
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Heading                                  */
/* -------------------------------------------------------------------------- */
export type CardHeadingProps = React.ComponentPropsWithRef<"div">;

export const CardHeading = autoRef(
  ({ className, ...props }: CardHeadingProps) => {
    return (
      <div
        className={cn(
          "flex flex-col items-start justify-center gap-1",
          className,
        )}
        {...props}
      />
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Actions                                  */
/* -------------------------------------------------------------------------- */
export type CardActionsProps = React.ComponentPropsWithRef<"div">;

export const CardActions = autoRef(
  ({ className, ...props }: CardActionsProps) => {
    return (
      <div className={cn("flex items-center gap-2", className)} {...props} />
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                                    Title                                   */
/* -------------------------------------------------------------------------- */
export type CardTitleProps = React.ComponentPropsWithRef<"h3">;

export const CardTitle = autoRef(({ className, ...props }: CardTitleProps) => {
  return (
    <h3
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/*                                 Description                                */
/* -------------------------------------------------------------------------- */
export type CardDescriptionProps = React.ComponentPropsWithRef<"p">;

export const CardDescription = autoRef(
  ({ className, ...props }: CardDescriptionProps) => {
    return (
      <p
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                                    Body                                    */
/* -------------------------------------------------------------------------- */
export type CardBodyProps = React.ComponentPropsWithRef<"div">;

export const CardBody = autoRef(({ className, ...props }: CardBodyProps) => {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
});

/* -------------------------------------------------------------------------- */
/*                                   Footer                                   */
/* -------------------------------------------------------------------------- */
export type CardFooterProps = React.ComponentPropsWithRef<"div">;

export const CardFooter = autoRef(
  ({ className, ...props }: CardFooterProps) => {
    return (
      <div
        className={cn("flex shrink-0 items-center p-6 pt-0", className)}
        {...props}
      />
    );
  },
);
