"use client";

import { useState } from "react";

import type { SelectOption, SelectOptions } from "@/collection/ui/select";
import { Select } from "@/collection/ui/select";

const options: SelectOptions<number> = [
  {
    label: "Peter Traube",
    value: 1,
    group: "Employees",
  },
  {
    label: "Monica Mere",
    value: 2,
    group: "Employees",
    disabled: true,
  },
  {
    label: "John Doe",
    value: 3,
  },
];

export default function Demo() {
  const [value, setValue] = useState<SelectOption<number> | null>(null);

  return (
    <Select
      isResettable
      className="w-[300px]"
      options={options}
      placeholder="Choose a person."
      value={value}
      description="This is a description"
      label="Select a value."
      errorMessage="Error Message"
      onChange={(option) => setValue(option)}
    />
  );
}
