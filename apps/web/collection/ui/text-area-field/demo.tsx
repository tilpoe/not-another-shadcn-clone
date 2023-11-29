import { TextAreaField } from "@/collection/ui/text-area-field";

export default function Demo() {
  return (
    <TextAreaField
      label="Textarea"
      description="This is a description"
      errorMessage="Error Message"
      placeholder="Placeholder"
      className="w-[300px]"
      rows={5}
    />
  );
}
