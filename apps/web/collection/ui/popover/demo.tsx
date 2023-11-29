import { TextField } from "react-aria-components";

import { Button } from "@/collection/ui/button";
import { Label } from "@/collection/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/collection/ui/popover";

export default function PopoverDemo() {
  return (
    <PopoverTrigger>
      <Button variant="outline">Open popover</Button>
      <Popover>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <PopoverContent>
          <div className="grid gap-2">
            <TextField className="grid grid-cols-3 items-center gap-4">
              <Label>Width</Label>
            </TextField>
          </div>
        </PopoverContent>
      </Popover>
    </PopoverTrigger>
  );
}
