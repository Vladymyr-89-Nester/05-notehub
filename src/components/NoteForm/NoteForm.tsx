import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import * as Yup from "yup";
import type { CreateNoteParams } from "../../services/noteService";

interface NoteFormProps {
  onClose: () => void;
  onSubmit: (values: CreateNoteParams) => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required")
    .trim(),
  content: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required")
    .trim(),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Please select a tag"),
});

export default function NoteForm({ onClose, onSubmit }: NoteFormProps) {
  const valuesOnForm = (
    values: CreateNoteParams,
    actions: FormikHelpers<CreateNoteParams>
  ) => {
    const valuesTrimmer = {
      tag: values.tag,
      content: values.content.trim(),
      title: values.title.trim(),
    };
    onSubmit(valuesTrimmer);

    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "" }}
      onSubmit={valuesOnForm}
      validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">
            Title{" "}
            <ErrorMessage
              name="title"
              className={css.error}
              component={"span"}
            />
          </label>
          <Field id="title" type="text" name="title" className={css.input} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">
            Content{" "}
            <ErrorMessage
              name="content"
              className={css.error}
              component={"span"}
            />
          </label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">
            Tag{" "}
            <ErrorMessage name="tag" className={css.error} component={"span"} />
          </label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="" disabled hidden>
              Select a tag
            </option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
