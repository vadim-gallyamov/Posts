import "./NotesListView.css";
import { NoteView } from "../NoteView";
import { NoteList } from "../../api/Note";
import { FC } from "react";


export interface NoteListViewProps {
  noteList: NoteList;
}

export const NoteListView: FC<NoteListViewProps> = ({ noteList }) => {
  return (
    <ul className="note-list-view">
      {noteList.map((note) =>  (
        <li key={note.id}>
          <NoteView note={note} />
        </li>
      ))}
      </ul>
  );
};
