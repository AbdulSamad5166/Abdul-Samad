import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import type { ZodType } from "zod";

type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;
type TouchedFields<TValues> = Partial<Record<keyof TValues, boolean>>;

interface UseFormResult<TValues extends Record<string, string>> {
  values: TValues;
  errors: FieldErrors<TValues>;
  touched: TouchedFields<TValues>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

export function useForm<TValues extends Record<string, string>>(
  initialValues: TValues,
  schema: ZodType<TValues>,
  onSubmit: (values: TValues) => void,
): UseFormResult<TValues> {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<TValues>>({});
  const [touched, setTouched] = useState<TouchedFields<TValues>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function getErrors(result: ReturnType<typeof schema.safeParse>): FieldErrors<TValues> {
    if (result.success) {
      return {};
    }

    const nextErrors: FieldErrors<TValues> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof TValues | undefined;
      if (field !== undefined && nextErrors[field] === undefined) {
        nextErrors[field] = issue.message;
      }
    }
    return nextErrors;
  }

  function validate(nextValues: TValues): FieldErrors<TValues> {
    // safeParse returns validation issues instead of throwing for invalid user input.
    return getErrors(schema.safeParse(nextValues));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const field = event.currentTarget.name as keyof TValues;
    const nextValues = { ...values, [field]: event.currentTarget.value };
    setValues(nextValues);

    if (touched[field] || submitAttempted) {
      setErrors(validate(nextValues));
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    const field = event.currentTarget.name as keyof TValues;
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(validate(values));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSubmitAttempted(true);

    const allTouched = Object.fromEntries(
      Object.keys(initialValues).map((field) => [field, true]),
    ) as TouchedFields<TValues>;
    setTouched(allTouched);

    const result = schema.safeParse(values);
    const nextErrors = getErrors(result);
    setErrors(nextErrors);

    if (result.success) {
      onSubmit(result.data);
    }
  }

  function resetForm(): void {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
  }

  const visibleErrors: FieldErrors<TValues> = {};
  for (const field of Object.keys(initialValues) as Array<keyof TValues>) {
    if ((touched[field] || submitAttempted) && errors[field]) {
      visibleErrors[field] = errors[field];
    }
  }

  return {
    values,
    errors: visibleErrors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
