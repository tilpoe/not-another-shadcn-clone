import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "cva";
import { cva } from "cva";

import { cn } from "@/lib/utils";

export const typographyVariants = cva({
  variants: {
    type: {
      default: "",
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

export type TypographyProps = VariantProps<typeof typographyVariants> & {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export const Typography = ({
  type,
  children,
  className,
  asChild,
}: TypographyProps) => {
  let Component;
  if (asChild) {
    Component = Slot;
  } else {
    switch (type) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "p":
      case "blockquote":
      case "code":
      case "small":
        Component = type;
        break;
      case "list":
        Component = "ul";
        break;
      case "lead":
      case "muted":
        Component = "p";
        break;
      case "large":
      default:
        Component = "div";
        break;
    }
  }

  return (
    <Component className={cn(typographyVariants({ type }), className)}>
      {children}
    </Component>
  );
};
