import { useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { FormAlert } from "../components/FormAlert";
import { FormInput } from "../components/FormInput";
import { useForm } from "../hooks/useForm";
import { registerSchema } from "../schemas/authSchemas";
import type { RegisterFormValues } from "../schemas/authSchemas";
import type { RegisterPayload } from "../types/auth";
import { getErrorMessage } from "../utils/getErrorMessage";

const initialValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterPage() {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
  });
  const { values, errors, handleBlur, resetForm, handleSubmit, handleChange } = useForm(
    initialValues,
    registerSchema,
    (formValues) => {
      setRegistrationSuccess(false);
      const payload: RegisterPayload = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      };
      // DummyJSON simulates user creation and does not persist the account for later login.
      mutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
          setRegistrationSuccess(true);
        },
      });
    },
  );

  function handleFieldChange(event: ChangeEvent<HTMLInputElement>): void {
    setRegistrationSuccess(false);
    mutation.reset();
    handleChange(event);
  }

  return (
    <AuthLayout title="Create your account" subtitle="Fill in your details to get started.">
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        {registrationSuccess && (
          <FormAlert variant="success">
            Account created successfully.{" "}
            <Link className="font-semibold underline" to="/login">
              Login
            </Link>
          </FormAlert>
        )}
        {mutation.isError && <FormAlert variant="error">{getErrorMessage(mutation.error)}</FormAlert>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            id="firstName"
            name="firstName"
            label="First name"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={values.firstName}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            error={errors.firstName}
            disabled={mutation.isPending}
          />
          <FormInput
            id="lastName"
            name="lastName"
            label="Last name"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            value={values.lastName}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            error={errors.lastName}
            disabled={mutation.isPending}
          />
        </div>
        <FormInput
          id="username"
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="Choose a username"
          value={values.username}
          onChange={handleFieldChange}
          onBlur={handleBlur}
          error={errors.username}
          disabled={mutation.isPending}
        />
        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleFieldChange}
          onBlur={handleBlur}
          error={errors.email}
          disabled={mutation.isPending}
        />
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={handleFieldChange}
          onBlur={handleBlur}
          error={errors.password}
          disabled={mutation.isPending}
        />
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={handleFieldChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          disabled={mutation.isPending}
        />
        <Button isLoading={mutation.isPending} loadingText="Creating account...">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
