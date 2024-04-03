import { TextField } from "@/collection/ui/text-field";

export default function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TextField multiline placeholder="I am a multiline text field" />
      <TextField
        multiline={{ rows: 6 }}
        placeholder="I am a multiline text field with 6 rows"
      />
    </div>
  );
}
