"use client";

import { Button } from "@/collection/ui/button";
import { Sheet, SheetTrigger } from "@/collection/ui/sheet";

export default function Demo() {
  return (
    <SheetTrigger>
      <Button variant="outline">Open Sheet</Button>
      <Sheet>was geht ab</Sheet>
    </SheetTrigger>
  );
}
