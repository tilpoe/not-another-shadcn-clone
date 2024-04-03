import { z } from "zod";

import { Button } from "@/collection/ui/button";
import { Radio, RadioGroup } from "@/collection/ui/radio";
import { Form, FormField, useForm } from "@/lib/form-v2";
import { toast } from "@/utils/toast";

const fileTypes = ["pdf", "csv"] as const;

export default function Demo() {
  const form = useForm(
    z.object({
      radio: z.enum(fileTypes).refine((val) => val === "pdf", {
        message: "Sike! You have to choose PDF!",
      }),
    }),
    {
      onSubmit: () => {
        toast.success("You did it!");
      },
    },
  );

  return (
    <Form form={form} className="flex flex-col gap-6">
      <FormField
        control={form.control}
        name="radio"
        defaultValue="pdf"
        render={({ field }) => (
          <RadioGroup
            label="Choose a file type"
            description="Choose wisely!"
            {...field}
          >
            <Radio value="pdf">PDF</Radio>
            <Radio value="csv">CSV</Radio>
          </RadioGroup>
        )}
      />
      <Button type="submit">Click me</Button>
    </Form>
  );
}
