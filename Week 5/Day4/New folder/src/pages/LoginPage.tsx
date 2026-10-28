import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { FormAlert } from "../components/FormAlert";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { loginSchema } from "../schemas/authSchemas";
import type { LoginFormValues } from "../schemas/authSchemas";
import type { LoginPayload } from "../types/auth";
import { getErrorMessage } from "../utils/getErrorMessage";

interface LoginLocationState {
  from?: Location;
}

const initialValues: LoginFormValues = { username: "", password: "" };

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
  });
  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    initialValues,
    loginSchema,
    (formValues) => {
      mutation.mutate(
        { ...formValues, expiresInMins: 60 },
        {
          onSuccess: (result) => {
            login(result.accessToken, result);
            const from = (location.state as LoginLocationState | null)?.from;
            const destination = from ? `${from.pathname}${from.search}${from.hash}` : "/dashboard";
            navigate(destination, { replace: true });
          },
        },
      );
    },
  );

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your account.">
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {mutation.isError && <FormAlert variant="error">{getErrorMessage(mutation.error)}</FormAlert>}
        <FormInput
          id="username"
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.username}
          disabled={mutation.isPending}
        />
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          disabled={mutation.isPending}
        />
        <Button isLoading={mutation.isPending} loadingText="Logging in...">
          Log in
        </Button>
        <p className="text-center text-sm text-slate-500">Demo account: emilys / emilyspass</p>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to="/register">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
