import React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "cva";
import { cva } from "cva";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const alertVariants = {
  root: cva({
    base: cn(
      /*       "relative w-full rounded-lg border p-4",
      "[&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7" */
      "relative grid w-full grid-cols-[auto_1fr] items-start gap-4 rounded-lg border p-4",
    ),
    variants: {
      type: {
        default: "bg-background text-foreground",
        error: "border-destructive bg-destructive/10 text-destructive",
        info: "border-sky-200 bg-sky-500/10 text-sky-900",
        warning: "border-orange-400 bg-orange-500/10 text-orange-800",
        success: "border-green-600 bg-green-500/10 text-green-900",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }),
  title: cva({
    base: "mb-1 h-5 font-medium leading-[1.25rem] tracking-tight",
  }),
  description: cva({
    base: "text-sm [&_p]:leading-relaxed",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

const IconWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Slot className="h-5 w-5">{children}</Slot>;
};

export type AlertProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof alertVariants.root> & {
    defaultIcon?: VariantProps<typeof alertVariants.root>["type"];
    icon?: React.ReactNode | null;
  };

export const Alert = autoRef(
  ({
    ref,
    className,
    children,
    type = "default",
    defaultIcon,
    icon,
    ...props
  }: AlertProps) => {
    const chosenIcon = defaultIcon ?? type;
    let Icon;
    switch (chosenIcon) {
      case "default": {
        Icon = null;
        break;
      }
      case "error": {
        Icon = (
          <IconWrapper>
            <AlertCircleIcon />
          </IconWrapper>
        );
        break;
      }
      case "info": {
        Icon = (
          <IconWrapper>
            <InfoIcon />
          </IconWrapper>
        );
        break;
      }
      case "warning": {
        Icon = (
          <IconWrapper>
            <AlertTriangleIcon />
          </IconWrapper>
        );
        break;
      }
      case "success": {
        Icon = (
          <IconWrapper>
            <CheckCircle2Icon />
          </IconWrapper>
        );
        break;
      }
    }

    if (icon !== undefined) {
      Icon = icon === null ? null : <IconWrapper>{icon}</IconWrapper>;
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants.root({ type }), className)}
        {...props}
      >
        {Icon}
        <div>{children}</div>
      </div>
    );
  },
);

/* ---------------------------------- Title --------------------------------- */

export type AlertTitleProps = React.ComponentPropsWithRef<"h5">;

export const AlertTitle = autoRef(
  ({ className, ...props }: AlertTitleProps) => {
    return <h5 className={cn(alertVariants.title(), className)} {...props} />;
  },
);

/* ------------------------------- Description ------------------------------ */

export type AlertDescriptionProps = React.ComponentPropsWithRef<"div">;

export const AlertDescription = autoRef(
  ({ className, ...props }: AlertDescriptionProps) => {
    return (
      <div className={cn(alertVariants.description(), className)} {...props} />
    );
  },
);
