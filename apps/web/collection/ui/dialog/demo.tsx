import { DialogTrigger } from "react-aria-components";

import { Button } from "@/collection/ui/button";
import {
  CloseDialogButton,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/collection/ui/dialog";

export default function Demo() {
  return (
    <DialogTrigger>
      <Button>Click me!</Button>
      <Dialog>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>This is a dialog</DialogTitle>
              <DialogDescription>
                I am describing this dialog.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>Hi there! I am the content of the dialog.</DialogBody>
            <DialogFooter>
              <CloseDialogButton close={close} />
              <Button onPress={close}>Done!</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}
