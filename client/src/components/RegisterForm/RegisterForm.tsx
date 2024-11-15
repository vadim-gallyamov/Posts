import { FormField } from "../FormField";
import { Button } from "../Button";
import "./RegisterForm.css";
import { FormEventHandler, useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "../../api/queryClient";
import { registerUser } from "../../api/User";
import {z} from "zod"

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<z.ZodError | null>(
    null
  );

  const registerMutation = useMutation(
    {
      mutationFn: () => registerUser(username, email, password),
    },
    queryClient
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const validationResult = UserSchema.safeParse({ username, email, password });

    if (validationResult.success) {
      registerMutation.mutate();
      setValidationError(null);
    } else {
      setValidationError(validationResult.error);
    }
  };

  const UserSchema = z.object({
    username: z
      .string()
      .min(5, "Имя пользователя должно быть не менее 5 символов"),
    email: z.string().email("Неверный формат электронной почты"),
    password: z
      .string()
      .min(8, "Пароль должен быть не менее 8 символов"),
  });

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <FormField
        label="Имя"
        errorMessage={validationError?.errors?.find(
          (error) => error.path?.toString() === "username"
        )?.message}
      >
        <input
          type="text"
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
      </FormField>
      <FormField
        label="Email"
        errorMessage={validationError?.errors?.find(
          (error) => error.path?.toString() === "email"
        )?.message}
      >
        <input
          type="text"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
      </FormField>
      <FormField
        label="Пароль"
        errorMessage={validationError?.errors?.find(
          (error) => error.path?.toString() === "password"
        )?.message}
      >
        <input
          type="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
      </FormField>

      {registerMutation.error && (
        <span>{registerMutation.error.message}</span>
      )}
      <Button type="submit" isLoading={registerMutation.isPending}>
        Зарегистрироваться
      </Button>
    </form>
  );
};
