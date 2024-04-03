import { z } from "zod";

import { Button } from "@/collection/ui/button";
import { TextField } from "@/collection/ui/text-field";
import { Form, FormField, useForm } from "@/lib/form-v2";
import { toast } from "@/utils/toast";

const formSchema = z.object({
  name: z.string().min(1, "I have to have a name"),
});

export default function Example() {
  const form = useForm(formSchema, {
    onSubmit: (data) => {
      toast.success(`Hi ${data.name}!`);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-6">
      <FormField
        control={form.control}
        name="name"
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Tell me your name"
            placeholder="Name"
            description="You can trust me!"
            {...field}
          />
        )}
      />
      <Button type="submit">Click me</Button>
    </Form>
  );
}
