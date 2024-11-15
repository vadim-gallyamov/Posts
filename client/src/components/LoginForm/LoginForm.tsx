import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";
import {z} from "zod";
import { FC, FormEventHandler, useState } from "react";
import { login } from "../../api/User";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});

const LoginSchema = z.object({
  email: z.string().min(5, "Почта должна быть не менее 5 символов"),
  password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
});

export const LoginForm: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<z.ZodError | null>(
    null
  );

  const loginMutation = useMutation(
    {
      mutationFn: () => login(email, password),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
    },
    queryClient
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const validationResult = LoginSchema.safeParse({ email, password });

    if (validationResult.success) {
      loginMutation.mutate();
      setValidationError(null);
    } else {
      setValidationError(validationResult.error);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <FormField
        label="Email"
        errorMessage={validationError?.errors?.find(
          (error) => error.path.toString() === "email"
        )?.message}
      >
        <input
          type="email"
          onChange={(event) => setEmail(event.currentTarget.value)}
          value={email}
        />
      </FormField>
      <FormField
        label="Пароль"
        errorMessage={validationError?.errors?.find(
          (error) => error.path.toString() === "password"
        )?.message}
      >
        <input
          type="password"
          onChange={(event) => setPassword(event.currentTarget.value)}
          value={password}
        />
      </FormField>

      {loginMutation.error && <span>{loginMutation.error.message}</span>}

      <Button type="submit" isLoading={loginMutation.isPending}>
        Войти
      </Button>
    </form>
  );
};
