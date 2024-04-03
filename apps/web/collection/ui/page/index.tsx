"use client";

import type { VariantProps } from "cva";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Container                                 */
/* -------------------------------------------------------------------------- */

const containerVariants = tv({
  base: "flex w-full items-center justify-center px-6 -sm:px-4",
  variants: {
    fitToScroll: {
      true: "grow overflow-scroll",
    },
  },
  defaultVariants: {
    fitToScroll: false,
  },
});

export const Container = ({
  children,
  className,
  fitToScroll,
}: {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof containerVariants>) => {
  return (
    <div className={cn(containerVariants({ fitToScroll }), className)}>
      {children}
    </div>
  );
};

const containerInnerVariants = tv({
  base: "h-full w-full max-w-6xl grow space-y-4",
  variants: {
    width: {
      default: "max-w-7xl",
      lg: "max-w-8xl",
      xl: "max-w-[90rem]",
      max: "max-w-[2000px]",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

export const ContainerInner = ({
  children,
  className,
  width,
}: {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof containerInnerVariants>) => {
  return (
    <div className={cn(containerInnerVariants({ width }), className)}>
      {children}
    </div>
  );
};

const barVariants = tv({
  base: "z-50",
  variants: {
    padding: {
      top: "pt-3 sm:pt-6",
      bottom: "pb-3 sm:pb-6",
      y: "py-3 sm:py-6",
      none: "",
    },
    border: {
      false: "",
      true: "border-b",
    },
    shadow: {
      false: "",
      true: "shadow-tight",
    },
  },
  defaultVariants: {
    padding: "top",
    border: false,
    shadow: false,
  },
});

/* -------------------------------------------------------------------------- */
/*                                     Bar                                    */
/* -------------------------------------------------------------------------- */

export const PageBar = ({
  children,
  padding,
  className,
  border,
  shadow,
}: {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof barVariants>) => {
  return (
    <Container
      className={cn(barVariants({ padding, border, shadow }), className)}
    >
      <ContainerInner>
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          {children}
        </div>
      </ContainerInner>
    </Container>
  );
};

export const PageBarLeft = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex items-center", className)}>{children}</div>;
};

export const PageBarRight = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex justify-end", className)}>{children}</div>;
};

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 truncate text-lg font-medium tracking-tight lg:text-xl",
      )}
    >
      {children}
    </h1>
  );
};
