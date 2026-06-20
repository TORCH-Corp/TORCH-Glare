import React from "react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  InputField,
} from "torch-glare";

// Form is react-hook-form's FormProvider. useForm() is not exported from the
// bundle, so we supply a minimal context object — enough for the field parts
// (FormLabel/FormControl/FormMessage read only getFieldState + formState).
// This keeps the composition static while rendering the REAL field anatomy.
const ctx = (error?: string) =>
  ({
    getFieldState: () => ({ error: error ? { message: error } : undefined }),
    formState: {},
  } as any);

// Canonical: labelled field with helper description.
export const Basic = () => (
  <Form {...ctx()}>
    <FormItem style={{ width: 320 }}>
      <FormLabel label="Email address" />
      <FormControl>
        <InputField type="email" placeholder="you@torchcorp.com" />
      </FormControl>
      <FormDescription>We&apos;ll never share your email.</FormDescription>
    </FormItem>
  </Form>
);

// Two stacked fields — a realistic mini form.
export const MultiField = () => (
  <Form {...ctx()}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <FormItem>
        <FormLabel label="First name" requiredLabel="*" />
        <FormControl>
          <InputField placeholder="Amelia" defaultValue="Amelia" />
        </FormControl>
      </FormItem>
      <FormItem>
        <FormLabel label="Last name" requiredLabel="*" />
        <FormControl>
          <InputField placeholder="Stone" defaultValue="Stone" />
        </FormControl>
      </FormItem>
    </div>
  </Form>
);

// Error state — invalid field surfaces the destructive message.
export const WithError = () => (
  <Form {...ctx("Enter a valid email address")}>
    <FormItem style={{ width: 320 }}>
      <FormLabel label="Email address" />
      <FormControl>
        <InputField defaultValue="not-an-email" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </Form>
);
