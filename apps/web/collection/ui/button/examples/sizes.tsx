import { BotIcon } from "lucide-react";

import { Button } from "@/collection/ui/button";

export default function Demo() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <Button size="sm">I am small</Button>
        <Button size="default">I am normal</Button>
        <Button size="lg">I am large</Button>
        <Button size="sm" iconOnly prefix={<BotIcon />} />
        <Button size="default" iconOnly prefix={<BotIcon />} />
        <Button size="lg" iconOnly prefix={<BotIcon />} />
      </div>
    </div>
  );
}
