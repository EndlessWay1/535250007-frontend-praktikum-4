"use client";
import { useState } from "react";

function PostPageComponent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [valError, setValError] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  const handleSubmit = async function () {};
  return (
    <section id='post'>
      <div className='login-background' />
      <div className='containers'>
        <form onSubmit={handleSubmit}>
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
              onChange={(e) => setImage(e.target.value)}
            />
            <label htmlFor='image' className='pr-36'>
              {image ? "Image Inserted" : "Custom Image"}
            </label>
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
