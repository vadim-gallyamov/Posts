import { useQuery } from "@tanstack/react-query"
import { fetchMe } from "../../api/User"
import { Loader } from "../Loader";
import { AuthForm } from "../AuthForm";
import { NoteForm } from "../NoteForm";
import { queryClient } from "../../api/queryClient";
import { FetchNoteListView } from "../NotesListView/FetchNoteListView";
import { LogoutButton } from "../LogoutButton";

import { UserView } from "../UserView";


export const Account = () => {
 const meQuery = useQuery( {
    queryFn: () => fetchMe(),
    queryKey: ["me"],
    retry: 0
  }, queryClient
);

  switch (meQuery.status) {
    case "pending":
      return <Loader />;

  case 'error':
    return <AuthForm />;

    case "success":
      return (<div>
      <UserView user={meQuery.data}/>
      <NoteForm />
      <LogoutButton />
      <FetchNoteListView/>
      </div>)

  }
}

