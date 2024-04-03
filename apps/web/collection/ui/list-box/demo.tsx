import { DropdownItem, ListBox } from "@/collection/ui/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Favorite animal" selectionMode="single">
      <DropdownItem>Dog</DropdownItem>
      <DropdownItem>Cat</DropdownItem>
      <DropdownItem>Hamster</DropdownItem>
    </ListBox>
  );
}
