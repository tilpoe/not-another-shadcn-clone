import { Button } from "@/collection/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Default variant</h3>
      <div className="flex gap-4">
        <Button variant="default/primary">Primary</Button>
        <Button variant="default/secondary">Secondary</Button>
        <Button variant="default/destructive">Destructive</Button>
      </div>
      <h3 className="font-medium">Outline variant</h3>
      <div className="flex gap-4">
        <Button variant="outline/primary">Primary</Button>
        <Button variant="outline/secondary">Secondary</Button>
        <Button variant="outline/destructive">Destructive</Button>
      </div>
      <h3 className="font-medium">Ghost variant</h3>
      <div className="flex gap-4">
        <Button variant="ghost/primary">Primary</Button>
        <Button variant="ghost/secondary">Secondary</Button>
        <Button variant="ghost/destructive">Destructive</Button>
      </div>
    </div>
  );
}
