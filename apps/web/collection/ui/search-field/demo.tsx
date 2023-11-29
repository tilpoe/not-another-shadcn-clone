import { useState } from "react";

import { SearchField } from "@/collection/ui/search-field";

export default function Demo() {
  const [value, setValue] = useState("");

  return (
    <SearchField
      label="Search"
      placeholder="Search..."
      description="This is a description"
      errorMessage="Error Message"
      isInvalid
      value={value}
      onChange={setValue}
    />
  );
}
