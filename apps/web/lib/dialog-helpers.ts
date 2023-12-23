import { useState } from "react";

export type DialogState = ReturnType<typeof useDialog>;

export const useDialog = (options?: { onClose?: () => void }) => {
  const [open, setOpen] = useState(false);

  return {
    props: {
      isOpen: open,
      onOpenChange: setOpen,
    },
    isOpen: open,
    toggle: () => {
      setOpen((prev) => !prev);
    },
    close: () => {
      options?.onClose?.();
      setOpen(false);
    },
  };
};

export const useDialogState = <DialogState extends string>() => {
  const [state, setState] = useState<DialogState | undefined>();

  return {
    set: setState,
    state,
    is: (which: DialogState) => state === which,
    getProps: (which: DialogState) => ({
      isOpen: state === which,
      onOpenChange: (open: boolean) => {
        if (!open) {
          setState(undefined);
        } else {
          setState(which);
        }
      },
    }),
  };
};
