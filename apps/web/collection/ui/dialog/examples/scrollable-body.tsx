"use client";

import { DialogTrigger } from "react-aria-components";

import { Button } from "@/collection/ui/button";
import {
  CloseDialogButton,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/collection/ui/dialog";

export default function Demo() {
  return (
    <DialogTrigger>
      <Button>Open Dialog</Button>
      <Dialog classNames={{ root: "h-full" }}>
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
    </DialogTrigger>
  );
}
