import { useEffect, useState } from "react";
import { z } from "zod";
import { validateResponse } from "../api/validateResponse";


export const NoteSchema = z.object ( {
  id: z.string(),
  title: z.string(),
  text: z.string(),
  userId: z.string(),
  createdAt: z.number(),
});


export type Note = z.infer<typeof NoteSchema>;

export const NoteList = z.array(NoteSchema);

export type NoteList = z.infer<typeof NoteList>

export const FetchNoteListSchema = z.object( {
    list: NoteList,
});

type FetchNoteListResponse = z.infer<typeof FetchNoteListSchema>;

export function fetchNoteList(): Promise<FetchNoteListResponse> {
              return fetch("/api/notes")
              .then((response) => response.json())
              .then((data) => FetchNoteListSchema.parse(data));
}

interface IdleRequestState {
  status: "idle";

}

interface LoadingRequestState {
status: "pending";

}

interface SuccesRequestState {
status: "success";
data: NoteList;

}

interface ErrorRequestState {
  status: "error";
  error: unknown;


}

type RequestState =
| IdleRequestState
| LoadingRequestState
| SuccesRequestState
| ErrorRequestState

export function useNoteList() {
  const [state, setState] = useState<RequestState> ({ status: "idle" });

  useEffect(() => {
    if(state.status === "pending"){

    fetchNoteList().then((data) => {
      setState( {status: "success", data: data.list });
    }).catch((error) => {
      setState({ status: "error", error });
    });
  }
  }, [state]);

  useEffect(() => {
    setState({status:"pending"});
  }, []);

  const refetch = () => {
    setState({status: "pending"});
  }
  return{
    state,
    refetch,
  };
}

export function createNote({title, text}:{title: string, text: string}): Promise<void> {
  return fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title, text,
    }),
  })
  .then(validateResponse)
  .then(() => undefined);
}
