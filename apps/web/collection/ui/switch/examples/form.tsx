import { z } from "zod";

import { Button } from "@/collection/ui/button";
import { Switch } from "@/collection/ui/switch";
import { Form, FormField, useForm } from "@/lib/form-v2";
import { toast } from "@/utils/toast";

export default function Example() {
  const form = useForm(
    z.object({
      switch: z.boolean().refine((val) => val === false, {
        message: "You have to turn it off!",
      }),
    }),
    {
      onSubmit: () => {
        toast.success("It's the small things that count!");
      },
    },
  );

  return (
    <Form form={form} className="flex flex-col gap-6">
      <FormField
        control={form.control}
        name="switch"
        defaultValue={true}
        render={({ field }) => (
          <Switch
            label="Turn off the lights"
            description="You have to save money!"
            isSelected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Button type="submit">Click me</Button>
    </Form>
  );
}
