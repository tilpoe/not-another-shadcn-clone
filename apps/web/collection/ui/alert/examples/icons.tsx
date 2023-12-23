import { Rabbit } from "lucide-react";

import { Alert, AlertTitle } from "@/collection/ui/alert";

export default function Example() {
  return (
    <div className="w-full max-w-[400px] space-y-4">
      <Alert defaultIcon="info">
        <AlertTitle>Use a predefined icon.</AlertTitle>
      </Alert>
      <Alert icon={<Rabbit />} type="info">
        <AlertTitle>Use a custom icon.</AlertTitle>
      </Alert>
      <Alert type="warning" icon={null}>
        <AlertTitle>But you don&apos;t have to use an icon</AlertTitle>
      </Alert>
    </div>
  );
}
