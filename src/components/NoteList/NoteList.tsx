import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NodeListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NodeList({ notes, onDelete }: NodeListProps) {
  const onDeleteNote = (id: string) => {
    onDelete(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => onDeleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
