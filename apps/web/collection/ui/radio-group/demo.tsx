import { RadioGroup, RadioGroupItem } from "@/collection/ui/radio-group";

export default function Demo() {
  return (
    <RadioGroup
      defaultValue="comfortable"
      label="Choose an option."
      description="This is the level of softness."
      errorMessage="Error Message"
      isInvalid
    >
      <RadioGroupItem value="default">Default</RadioGroupItem>
      <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
      <RadioGroupItem value="compact">Compact</RadioGroupItem>
    </RadioGroup>
  );
}
