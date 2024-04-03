import React from "react";
import type {
  DialogProps,
  PopoverProps as RACPopoverProps,
} from "react-aria-components";
import { Dialog, Popover as RACPopover } from "react-aria-components";
import { tv } from "tailwind-variants";

import type {
  DialogBodyProps,
  DialogDescriptionProps,
  DialogHeaderProps,
  DialogTitleProps,
} from "@/collection/ui/dialog";
import {
  DialogBody,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/collection/ui/dialog";
import { cn, composeClassName } from "@/lib/ui";

export interface PopoverProps extends Omit<RACPopoverProps, "children"> {
  showArrow?: boolean;
  children: React.ReactNode;
}

const popoverStyles = tv({
  base: "min-w-48 bg-white shadow-md rounded-md bg-clip-padding border",
  variants: {
    isEntering: {
      true: "animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 placement-left:slide-in-from-right-1 placement-right:slide-in-from-left-1 ease-out duration-200",
    },
    isExiting: {
      true: "animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 placement-left:slide-out-to-right-1 placement-right:slide-out-to-left-1 ease-in duration-150",
    },
  },
});

export const Popover = ({ children, className, ...props }: PopoverProps) => {
  return (
    <RACPopover
      {...props}
      className={composeClassName(className, (className, renderProps) =>
        popoverStyles({ ...renderProps, className }),
      )}
    >
      {children}
    </RACPopover>
  );
};

export const PopoverInner = (props: DialogProps) => {
  return (
    <Dialog {...props} className={cn("outline outline-0", props.className)} />
  );
};

export const PopoverHeader = ({ ...props }: DialogHeaderProps) => {
  return <DialogHeader {...props} />;
};

export const PopoverTitle = ({ className, ...props }: DialogTitleProps) => {
  return <DialogTitle className={cn("px-4 pt-4", className)} {...props} />;
};

export const PopoverDescription = ({
  className,
  ...props
}: DialogDescriptionProps) => {
  return <DialogDescription className={cn("px-4", className)} {...props} />;
};

export const PopoverBody = ({ className, ...props }: DialogBodyProps) => {
  return <DialogBody className={cn("p-4", className)} {...props} />;
};
