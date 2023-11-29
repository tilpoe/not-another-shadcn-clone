import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/collection/ui/alert";

export default function AlertDemo() {
  return (
    <Alert icon={<Terminal />}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}
