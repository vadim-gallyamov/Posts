import { useQuery } from "@tanstack/react-query";
import { fetchNoteList} from "../../api/Note"
import { Loader } from "../Loader";
import { NoteListView } from "./NotesListView";
import { queryClient } from "../../api/queryClient";

 export const FetchNoteListView = () => {


  const noteListQuery = useQuery( {
    queryFn: () => fetchNoteList(),
    queryKey: ["notes"],
  },
  queryClient
)


  switch(noteListQuery.status) {

    case "pending":
      return <Loader />;

      case "success":
      return <NoteListView noteList={noteListQuery.data.list} />;

      case "error":
        return (
          <div>
            <span>Произошла ошибка:(</span>

            <button onClick={() => noteListQuery.refetch()}> Повторить запрос</button>
          </div>
        );
  }
}
