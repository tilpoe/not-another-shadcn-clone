import type { LinkProps } from "next/link";
import NextLink from "next/link";
import { cva } from "cva";

import { autoRef, cn } from "@/lib/utils";

export const linkVariants = {
  root: cva({
    base: "mt-2 block text-xs text-muted-foreground underline hover:text-foreground",
  }),
};

const LinkInternal = <TRoute,>({
  styled,
  className,
  ...restProps
}: LinkProps<TRoute> & {
  styled?: boolean;
  className?: string;
}) => {
  return (
    <NextLink
      {...restProps}
      className={cn(styled && linkVariants.root(), className)}
    />
  );
};

export const Link = autoRef(LinkInternal);
