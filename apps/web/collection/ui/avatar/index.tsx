"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "cva";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const avatarVariants = {
  root: cva({
    base: "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
  }),
  image: cva({
    base: "aspect-square h-full w-full",
  }),
  fallback: cva({
    base: "flex h-full w-full items-center justify-center rounded-full bg-muted",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export type AvatarProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Root
>;

export const Avatar = autoRef(({ className, ...props }: AvatarProps) => {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants.root(), className)}
      {...props}
    />
  );
});

/* ---------------------------------- Image --------------------------------- */

export type AvatarImageProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Image
>;

export const AvatarImage = autoRef(
  ({ className, ...props }: AvatarImageProps) => {
    return (
      <AvatarPrimitive.Image
        className={cn(avatarVariants.image(), className)}
        {...props}
      />
    );
  },
);

/* -------------------------------- Fallback -------------------------------- */

export type AvatarFallbackProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Fallback
>;

export const AvatarFallback = autoRef(
  ({ className, ...props }: AvatarFallbackProps) => {
    return (
      <AvatarPrimitive.Fallback
        className={cn(avatarVariants.fallback(), className)}
        {...props}
      />
    );
  },
);
