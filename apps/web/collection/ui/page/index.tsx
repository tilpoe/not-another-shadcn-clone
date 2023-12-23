"use client";

import Link from "next/link";
import type { VariantProps } from "cva";
import { cva } from "cva";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/collection/ui/button";
import { Container, ContainerInner } from "@/collection/ui/container";
import type { NextRoute } from "@/lib/navigation/utils";
import { cn } from "@/lib/utils";

const barVariants = cva({
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

export const BackButton = <TRoute,>({
  className,
  href,
}: {
  className?: string;
  href: NextRoute<TRoute>;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost", icon: true }),
        "mr-2",
        className,
      )}
    >
      <ArrowLeft />
    </Link>
  );
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
