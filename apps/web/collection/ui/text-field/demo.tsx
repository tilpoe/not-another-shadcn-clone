import { TextField } from "@/collection/ui/text-field";

export default function Demo() {
  return (
    <TextField
      label="Label"
      description="Description"
      placeholder="This is a placeholder"
      errorMessage="Error Message"
      isInvalid
    />
  );
}
