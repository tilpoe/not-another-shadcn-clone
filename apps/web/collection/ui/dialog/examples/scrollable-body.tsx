"use client";

import { Button, CloseDialogButton } from "@/collection/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/collection/ui/dialog";
import { useDialog } from "@/lib/dialog-helpers";

export default function Demo() {
  const dialog = useDialog();

  console.log(dialog.isOpen);

  return (
    <>
      <Button onPress={dialog.toggle}>Open Dialog</Button>
      <Dialog {...dialog.props} className="h-full">
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Scroll me</DialogTitle>
            </DialogHeader>
            <DialogBody className="grow">
              <ul className="overflow-auto">
                {Array.from({ length: 100 }).map((_, i) => (
                  <li className="h-4" key={i}>
                    {i}
                  </li>
                ))}
              </ul>
            </DialogBody>
            <DialogFooter>
              <CloseDialogButton close={close} />
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
}
