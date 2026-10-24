"use client";
import { useEffect, useState } from "react";
import PostEvent from "../components/PostEvent";

function EventPageComponent() {
  const [globalError, setGlobalError] = useState("");
  const [post, setPost] = useState([]);
  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch("/api/event", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!response.ok) {
          setGlobalError("Failed to get event, please try again later.");
          return;
        }

        const res = await response.json();
        console.log(res);
        console.log(res.post);
        setPost(res.post);
      } catch (error) {
        console.log(error);
        setGlobalError("A network error occurred. Please try again.");
        return;
      }
    }
    getPost();
  }, []);
  return (
    <>
      <div
        className={`grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 h-fit w-full items-center justify-center  mt-20 p-5`}
      >
        {globalError.length > 0 ? (
          <h2 className='text-lg'>{globalError}</h2>
        ) : post.length > 0 ? (
          post.map(
            ({ id, title, content, eventDate, createdAt, imageType, user }) => (
              <PostEvent
                key={id}
                id={id}
                title={title}
                content={content}
                eventDate={new Date(eventDate)}
                createdAt={new Date(createdAt)}
                imageType={imageType}
                user={user}
              />
            ),
          )
        ) : (
          <h2 className='text-lg'>{"No events currently present."}</h2>
        )}
      </div>
    </>
  );
}
export default EventPageComponent;
