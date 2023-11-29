"use client";

import { TextField } from "react-aria-components";

import { Button, CloseDialogButton } from "@/collection/ui/button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/collection/ui/dialog";
import { Input, Label } from "@/collection/ui/form";

export default function DialogDemo() {
  return (
    <DialogTrigger>
      <Button variant="outline">Edit Profile</Button>
      <Dialog>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <TextField
                defaultValue="Pablo Muerte"
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label>Name</Label>
                <Input className="col-span-3" />
              </TextField>
            </DialogBody>
            <DialogFooter>
              <CloseDialogButton close={close} />
              <Button>Save changes</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}
