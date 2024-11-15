import { FormField } from "../FormField";
import { Button } from "../Button";
import "./NoteForm.css";
import { FC, FormEventHandler, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "../../api/Note";
import { queryClient } from "../../api/queryClient";
import {z} from "zod"

export interface INoteFormProps {}

const NoteSchema = z.object({
  title: z.string().min(5, "Заголовок должен быть не менее 5 символов"),
  text: z
    .string()
    .min(10, "Текст должен быть не менее 10 символов")
    .max(300, "Текст должен быть не более 300 символов"),
});

export const NoteForm: FC<INoteFormProps> = () => {
  const [text, setText] = useState ("");
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState<z.ZodError | null>(
    null
  );

 const createNoteMutation =  useMutation({
    mutationFn: () => createNote({title, text}),
    onSuccess(){
      queryClient.invalidateQueries( {queryKey: ["notes"]});
    },
  }, queryClient
);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const validationResult = NoteSchema.safeParse({ title, text});

    if (validationResult.success) {
      createNoteMutation.mutate();
      setValidationError(null);
    } else {
      setValidationError(validationResult.error);
    }
  };



  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <FormField
        label="Заголовок"
        errorMessage={
          validationError?.errors?.find(
            (error) => error.path.toString() === "title"
          )?.message
        }
      >
        <input
          type="text"
          name="title"
          onChange={(event) => setTitle(event.currentTarget.value)}
          value={title}
        />
      </FormField>
      <FormField
        label="Текст"
        errorMessage={
          validationError?.errors?.find(
            (error) => error.path.toString() === "text"
          )?.message
        }
      >
        <textarea
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
        />
      </FormField>
      <Button type="submit" isLoading={createNoteMutation.isPending}>
        Сохранить
      </Button>
    </form>
  );
};
