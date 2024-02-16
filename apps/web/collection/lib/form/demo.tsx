"use client";

import { useState } from "react";
import { z } from "zod";

import { Alert, AlertDescription } from "@/collection/ui/alert";
import { Button } from "@/collection/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/collection/ui/card";
import { NumberField } from "@/collection/ui/number-field";
import { RadioGroup, RadioGroupItem } from "@/collection/ui/radio-group";
import { TextField } from "@/collection/ui/text-field";
import { Form, FormField } from "@/lib/form";
import { transformField, useForm } from "@/lib/form/utils";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .number()
    .min(18, "You have to be at least 18 years old.")
    .max(130, "Shouldn't you be dead?"),
  type: z.enum(["student", "teacher"], {
    required_error: "Tell me if you're a student or a teacher.",
  }),
});

export default function Demo() {
  const [success, setSuccess] = useState(false);
  const form = useForm(formSchema, {
    onSubmit: (data) => {
      console.log(data);
      setSuccess(true);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <CardHeading>
          <CardTitle>Register</CardTitle>
        </CardHeading>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert type="success" className="mb-4">
            <AlertDescription>Successfully registered.</AlertDescription>
          </Alert>
        )}
        <Form form={form} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            defaultValue=""
            render={({ field }) => (
              <TextField label="Name" placeholder="Name" {...field} />
            )}
          />
          <FormField
            control={form.control}
            name="age"
            defaultValue={18}
            render={({ field }) => (
              <NumberField label="Age" placeholder="Age" {...field} />
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <RadioGroup label="Status" {...transformField(field, true)}>
                <RadioGroupItem value="teacher">Teacher</RadioGroupItem>
                <RadioGroupItem value="student">Student</RadioGroupItem>
              </RadioGroup>
            )}
          />
        </Form>
      </CardContent>
      <CardFooter>
        <Button onPress={form.handleSubmit}>Submit</Button>
      </CardFooter>
    </Card>
  );
}
