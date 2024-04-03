"use client";

import { Button } from "@/collection/ui/button-3";
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/collection/ui/sheet";

export default function Demo() {
  return (
    <SheetTrigger>
      <Button variant="outline">Open Sheet</Button>
      <Sheet>
        <SheetHeader>
          <SheetTitle>Hello Sheet!</SheetTitle>
          <SheetDescription>This is a Sheet.</SheetDescription>
        </SheetHeader>
        <SheetFooter>Hello bottom!.</SheetFooter>
      </Sheet>
    </SheetTrigger>
  );
}
