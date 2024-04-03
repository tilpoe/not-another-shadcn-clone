import { MenuTrigger } from "react-aria-components";

import { Button } from "@/collection/ui/button";
import { Menu, MenuItem } from "@/collection/ui/menu";

export default function Demo() {
  return (
    <MenuTrigger>
      <Button>Open menu</Button>
      <Menu>
        <MenuItem id={1}>Item 1</MenuItem>
        <MenuItem id={2}>Item 2</MenuItem>
        <MenuItem id={3}>Item 3</MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
