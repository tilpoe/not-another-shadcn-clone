"use client";

import { NumberField } from "@/collection/ui/number-field";

export default function Demo() {
  return (
    <NumberField
      label="Number Field"
      description="This is a number field."
      errorMessage="Error Message"
      defaultValue={0}
      isInvalid
    />
  );
}
