import { DialogTrigger } from "react-aria-components";

import { Button } from "@/collection/ui/button";
import {
  Popover,
  PopoverBody,
  PopoverDescription,
  PopoverHeader,
  PopoverInner,
  PopoverTitle,
} from "@/collection/ui/popover";
import { TextField } from "@/collection/ui/text-field";

export default function PopoverDemo() {
  return (
    <DialogTrigger>
      <Button>Open popover</Button>
      <Popover>
        <PopoverInner>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <PopoverBody>
            <div className="grid gap-2">
              <TextField label="Width" />
            </div>
          </PopoverBody>
        </PopoverInner>
      </Popover>
    </DialogTrigger>
  );
}
