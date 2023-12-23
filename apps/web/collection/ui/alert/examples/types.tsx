import { Alert, AlertTitle } from "@/collection/ui/alert";

export default function Example() {
  return (
    <div className="w-full max-w-[400px] space-y-4">
      <Alert type="success">
        <AlertTitle>Success.</AlertTitle>
      </Alert>
      <Alert type="info">
        <AlertTitle>Info.</AlertTitle>
      </Alert>
      <Alert type="warning">
        <AlertTitle>Warning.</AlertTitle>
      </Alert>
      <Alert type="error">
        <AlertTitle>Error.</AlertTitle>
      </Alert>
    </div>
  );
}
