import { useState } from "react";

import { Button } from "@/collection/ui/button";
import { Checkbox } from "@/collection/ui/checkbox";

export default function Example() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        isSelected={isLoading}
        onChange={setIsLoading}
        label="Loading"
      />
      <Button isLoading={isLoading}>Hi, i am currently not loading.</Button>
    </div>
  );
}
