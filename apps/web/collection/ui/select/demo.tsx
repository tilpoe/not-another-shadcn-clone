"use client";

import { Select, SelectItem } from "@/collection/ui/select";

export default function Demo() {
  return (
    <Select>
      <SelectItem id={1}>Option 1</SelectItem>
      <SelectItem id={2}>Option 2</SelectItem>
      <SelectItem id={3}>Option 3</SelectItem>
    </Select>
  );
}
