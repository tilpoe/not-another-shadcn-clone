import { z } from "zod";

import { Button } from "@/collection/ui/button";
import { Select, SelectItem } from "@/collection/ui/select";
import { Form, FormField, useForm } from "@/lib/form-v2";
import { toast } from "@/utils/toast";

const items = [
  {
    id: 1,
    name: "Option 1",
  },
  {
    id: 2,
    name: "Option 2",
  },
  {
    id: 3,
    name: "Option 3",
  },
];

export default function Example() {
  const form = useForm(
    z.object({
      selected: z.object(
        {
          id: z.number(),
          name: z.string(),
        },
        {
          required_error: "Please select an option",
        },
      ),
    }),
    {
      defaultValues: {
        selected: items[0],
      },
      onSubmit: (data) => {
        toast.success(`Greate choice! You selected: ${data.selected.name}`);
      },
    },
  );

  return (
    <Form form={form} className="max-w-72 flex w-full flex-col gap-6">
      <FormField
        control={form.control}
        name="selected"
        render={() => (
          <Select
            items={items}
            label="Select an option"
            placeholder="Click me"
            description="Choose wisely!"
            defaultSelectedKey={1}
            onSelectionChange={(itemId) => {
              const item = items.find((item) => item.id === Number(itemId));
              if (item) {
                form.setValue("selected", item);
              }
            }}
          >
            {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
          </Select>
        )}
      />
      <Button type="submit">Click me</Button>
    </Form>
  );
}
