import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import NodeList from "../NoteList/NoteList";
import css from "./App.module.css";
import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNoteParams,
} from "../../services/noteService";
import { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [queryDebounce] = useDebounce(query, 700);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const hasShownEmptyToast = useRef(false);
  const prevQuery = useRef("");

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, queryDebounce],
    queryFn: () =>
      fetchNotes({
        page: page,
        perPage: 12,
        search: queryDebounce,
      }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: (newNote: CreateNoteParams) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsOpenModal(false);
      toast.success("Note added successfully!", { duration: 7000 });
    },
    onError: () => {
      toast.error("Failed to add note. Please try again.", { duration: 7000 });
    },
  });

  const deleteteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted", { duration: 7000 });
    },
    onError: () => {
      toast.error("Failed to delete note", { duration: 7000 });
    },
  });

  useEffect(() => {
    if (queryDebounce !== prevQuery.current) {
      hasShownEmptyToast.current = false;
      prevQuery.current = queryDebounce;
    }

    const shouldShowToast =
      !isLoading &&
      !isError &&
      queryDebounce !== "" &&
      data?.notes.length === 0;

    if (shouldShowToast && !hasShownEmptyToast.current) {
      toast("No notes found for your search", {
        icon: "ℹ️",
        duration: 5000,
      });
      hasShownEmptyToast.current = true;
    }
  }, [data, isLoading, isError, queryDebounce]);

  const handleSearchChange = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const handleCreateNote = (newNote: CreateNoteParams) => {
    createNoteMutation.mutate(newNote);
  };

  const handleDeleteteNote = (id: string) => {
    deleteteNoteMutation.mutate(id);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox query={query} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && data && data.notes.length > 0 && (
        <NodeList notes={data.notes} onDelete={handleDeleteteNote} />
      )}
      {isOpenModal && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
}
