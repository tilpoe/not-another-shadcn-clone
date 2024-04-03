"use client";

import { ComboBox } from "@/collection/ui/combo-box";
import { SelectItem } from "@/collection/ui/select";

export default function Demo() {
  return (
    <ComboBox label="Combobox" placeholder="Search for an option">
      <SelectItem id={1}>Option 1</SelectItem>
      <SelectItem id={2}>Option 2</SelectItem>
      <SelectItem id={3}>Option 3</SelectItem>
    </ComboBox>
  );
}
