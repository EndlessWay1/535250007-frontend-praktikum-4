"use client";
import { useEffect, useState } from "react";

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
      <div className='flex flex-col h-full w-full items-center justify-center p-5'>
        {globalError.length > 1 ? (
          <h2 className='text-lg'>{globalError}</h2>
        ) : post.length > 1 ? (
          <ul>
            {post.map(({ title, content }, idx) => (
              <li key={idx}>
                <div>
                  <h1>{title}</h1>
                  <p>{content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <h2 className="text-lg">{"No events currently present."}</h2>
        )}
      </div>
    </>
  );
}
export default EventPageComponent;
