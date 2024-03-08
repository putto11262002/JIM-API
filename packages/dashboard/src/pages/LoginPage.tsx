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
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { useNavigate } from "react-router-dom";
import { loginThunk } from "../redux/thunk/auth-thunk";
import { AuthStatus } from "../redux/auth-reducer";
import {  z } from "zod";
import { StaffLoginFormSchema } from "../schemas/staff";
export default function LoginPage() {
  // const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, isLogin, error } = useAppSelector((state) => state.auth);
  const form = useForm<z.infer<typeof StaffLoginFormSchema>>({
    resolver: zodResolver(StaffLoginFormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  // const { mutate: handleLogin } = useMutation({
  //   mutationFn: async (data: StaffLoginDTO) => {
  //     const loginRes = await StaffAuthService.login(data);
  //     setErrorMsg(null);
  //     dispatch(login(loginRes.data.staff));
  //   },
  //   onError: (error) => {
  //     const errRes = StaffAuthService.handleError(error);
  //     setErrorMsg(errRes.message);
  //   },
  // });

  function handleLogin(data: z.infer<typeof StaffLoginFormSchema>) {
    dispatch(loginThunk(data));
  }

  useEffect(() => {
    if (
      status !== AuthStatus.LOADING &&
      isLogin
    ) {
      navigate("/");
    }
  }, [status, isLogin, navigate]);

  return (
    <FormLayout className="pt-[30vh] flex justify-center items-center">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">Jimmodel</h1>
        <h3 className="text text-center">Model Management Platform</h3>

        <h2 className="font-bold text-center py-3">Login</h2>

        {error && (
          <Alert variant="destructive" className="my-3">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit((data) => handleLogin(data))}
          >
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

            <div className="py-3 text-center">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </Form>

        <a
          className="underline text-sm text-center block mt-4"
          href="/reset-password"
        >
          Forgot password
        </a>
      </div>
    </FormLayout>
  );
}
