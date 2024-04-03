import type { ComponentPropsWithoutRef } from "react";
import NextLink from "next/link";
import { tv } from "tailwind-variants";

import type { NextRoute } from "@/lib/navigation";
import { cn } from "@/lib/ui";

export const linkVariants = tv({
  base: "block text-xs text-muted-foreground underline hover:text-foreground",
});

type LinkProps<T> = {
  styled?: boolean;
} & (
  | (ComponentPropsWithoutRef<"a"> & {
      external: true;
    })
  | (Omit<ComponentPropsWithoutRef<typeof NextLink>, "href"> & {
      external?: false;
      href: NextRoute<T>;
    })
);

export const Link = <T,>({ styled, className, ...props }: LinkProps<T>) => {
  if (props.external) {
    return <a {...props} className={cn(styled && linkVariants(), className)} />;
  }

  return (
    <NextLink {...props} className={cn(styled && linkVariants(), className)} />
  );
};
