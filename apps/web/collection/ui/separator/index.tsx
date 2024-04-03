import type { SeparatorProps } from "react-aria-components";
import { Separator as RACSeparator } from "react-aria-components";
import { tv } from "tailwind-variants";

const separatorVariants = tv({
  base: "bg-muted",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px h-full",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export function Separator(props: SeparatorProps) {
  return (
    <RACSeparator
      {...props}
      className={separatorVariants({
        orientation: props.orientation,
        className: props.className,
      })}
    />
  );
}
