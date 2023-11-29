"use client";

import { Checkbox } from "@/collection/ui/checkbox";

export default function CheckboxDemo() {
  return (
    <Checkbox
      label="Label"
      description="This is a description."
      errorMessage="Error Message"
      isInvalid
      defaultSelected={true}
    />
  );
}
