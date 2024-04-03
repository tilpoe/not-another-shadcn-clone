import { Radio } from "@/collection/ui/radio";
import { RadioGroup } from "@/collection/ui/radio-group";

export default function Demo() {
  return (
    <RadioGroup label="Radio Group">
      <Radio value="1">Option 1</Radio>
      <Radio value="2">Option 2</Radio>
    </RadioGroup>
  );
}
