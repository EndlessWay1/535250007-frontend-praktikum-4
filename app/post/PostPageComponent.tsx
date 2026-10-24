"use client";
import { ComponentProps, useState } from "react";
import z from "zod";
import { useCsrf } from "../context/csrf/CsrfContext";
import { redirect } from "next/navigation";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const postSchema = z.object({
  title: z
    .string()
    .min(1)
    .transform((val) => toTitleCase(val)),
  content: z.string().min(1),
  image: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5Mb.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    )
    .nullable()
    .optional(),
  eventDate: z.date(),
});

function PostPageComponent() {
  const { csrfToken } = useCsrf();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [valError, setValError] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> =
    async function (e) {
      e.preventDefault();
      setGlobalError("");
      setValError({});
      const res = postSchema.safeParse({ title, content, image, eventDate });

      console.log(image);

      if (!res.success) {
        const err: Record<string, string> = {};
        const error = res.error;

        error.issues.map(({ path, message }) => {
          if (path.length > 0) {
            err[path[0].toString()] = message;
          }
        });

        setValError(err);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("title", res.data.title);
        formData.append("content", res.data.content);
        formData.append("eventDate", res.data.eventDate.toISOString());
        if (res.data.image) formData.append("image", res.data.image);

        const response = await fetch("/api/event", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          body: formData,
        });

        const result = await response.json();
        console.log(result);
        if (!response.ok) {
          setGlobalError(result.error);
          return;
        }
      } catch (error) {
        console.log(error);
        setGlobalError("A network error occurred. Please try again.");
        return;
      }

      redirect("/event");
    };
  return (
    <section id='post'>
      <div className='login-background' />
      <div className='containers'>
        <form onSubmit={(e) => handleSubmit(e)} method='POST'>
          <h1>Post Events</h1>
          <div className='login-input'>
            <input
              type='text'
              placeholder='Title'
              required
              name='title'
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className='error-message'>{valError["title"] ?? ""}</span>
          </div>
          <div className='login-input'>
            <textarea
              rows={4}
              placeholder='Your Content'
              required
              name='content'
              onChange={(e) => setContent(e.target.value)}
            />
            <span className='error-message'>{valError["content"] ?? ""}</span>
          </div>
          <div className='login-input'>
            <input
              type='file'
              name='image'
              id='image'
              placeholder='Custom Image'
              className='hidden'
              accept='.jpg, .jpeg, .png, .webp'
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
            <label htmlFor='image'>{image ? image.name : "Custom Image"}</label>
            <span className='error-message'>{valError["image"] ?? ""}</span>
          </div>
          <div className='login-input'>
            <input
              className='pr-34'
              type='date'
              name='date'
              onChange={(e) => setEventDate(new Date(e.target.value))}
            />
            <span className='error-message'>{valError["date"] ?? ""}</span>
          </div>
          <p className='error-message px-4'>{globalError}</p>

          <div className='submit-form '>
            <button className='submit-button' type='submit'>
              Post
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
export default PostPageComponent;
