"use client";

import { ChevronDown } from "lucide-react";

import {
  Button,
  ButtonIcon,
  CloseDialogButton,
} from "@/collection/ui/button-3";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/collection/ui/dropdown-menu";
import { useDialogState } from "@/lib/dialog-helpers";

export default function Example() {
  const dialogState = useDialogState<"dialog">();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span>Aktionen</span>
            <ButtonIcon icon={<ChevronDown />} className="ml-2 mr-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => dialogState.set("dialog")}>
              Öffne mich.
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog {...dialogState.getProps("dialog")}>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Dialog</DialogTitle>
            </DialogHeader>
            <DialogBody isDescription>Hey ich bin ein Dialog.</DialogBody>
            <DialogFooter>
              <CloseDialogButton close={close} />
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
}
