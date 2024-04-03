"use client";

import { Button, CloseDialogButton } from "@/collection/ui/button-3";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/collection/ui/dialog-v2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/collection/ui/dropdown-menu";
import { useDialogState } from "@/lib/dialog-helpers";

export default function Demo() {
  const dialogState = useDialogState<"delete">();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Open Dropdown</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => dialogState.set("delete")}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog {...dialogState.getProps("delete")} isAlert>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Remove</DialogTitle>
              <DialogBody isDescription>
                Are you sure you want to delete this item?
              </DialogBody>
              <DialogFooter>
                <Button intent="destructive">Delete</Button>
                <CloseDialogButton close={close} />
              </DialogFooter>
            </DialogHeader>
          </>
        )}
      </Dialog>
    </>
  );
}
