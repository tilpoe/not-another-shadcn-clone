import { z } from "zod";

import { Button } from "@/collection/ui/button";
import { Checkbox } from "@/collection/ui/checkbox";
import { Form, FormField, useForm } from "@/lib/form-v2";
import { toast } from "@/utils/toast";

export default function Example() {
  const form = useForm(
    z.object({
      isChecked: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions.",
      }),
    }),
    {
      onSubmit: () => {
        toast.warning("Did you really read the fine print? 🤔");
      },
    },
  );

  return (
    <Form form={form} className="flex flex-col gap-6">
      <FormField
        control={form.control}
        name="isChecked"
        defaultValue={false}
        render={({ field }) => (
          <Checkbox
            label="I agree to the terms and conditions"
            description="Make sure to read the fine print."
            isSelected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Button type="submit">Click me</Button>
    </Form>
  );
}
