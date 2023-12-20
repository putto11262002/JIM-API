import React from "react";
import FormLayout from "../components/layouts/FormLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const form = useForm();

  function handleSubmit(data: any){

  }
  return (
    <FormLayout className="pt-[30vh] flex justify-center items-center">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">Jimmodel</h1>
        <h3 className="text text-center">Model Management Platform</h3>

        <h2 className="font-bold text-center py-3">Login</h2>

        <Form  {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
            name="usernameOrEmail"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl {...field}>
                  <Input type="text" />
                </FormControl>
                {error?.message && <FormMessage>{error.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl {...field}>
                  <Input type="password" />
                </FormControl>
                {error?.message && <FormMessage>{error.message}</FormMessage>}
              </FormItem>
            )}
          />

          <div className="py-3 text-center"><Button type="submit">Login</Button></div>
        </form>
        </Form>

        <a className="underline text-sm text-center block mt-4" href="/reset-password">Forgot password</a>
      </div>
    </FormLayout>
  );
}
