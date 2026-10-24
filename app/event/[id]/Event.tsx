"use client";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import Image from "next/image";

// Source - https://stackoverflow.com/a/7641822
// Posted by Hari Pachuveetil, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-24, License - CC BY-SA 3.0

function prettyDate(time: Date) {
  const date = time,
    diff = (new Date().getTime() - date.getTime()) / 1000,
    day_diff = Math.floor(diff / 86400);
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();

  if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
    return (
      year.toString() +
      "-" +
      (month < 10 ? "0" + month.toString() : month.toString()) +
      "-" +
      (day < 10 ? "0" + day.toString() : day.toString())
    );

  const r =
    (day_diff == 0 &&
      ((diff < 60 && "just now") ||
        (diff < 120 && "1 minute ago") ||
        (diff < 3600 && Math.floor(diff / 60) + " minutes ago") ||
        (diff < 7200 && "1 hour ago") ||
        (diff < 86400 && Math.floor(diff / 3600) + " hours ago"))) ||
    (day_diff == 1 && "Yesterday") ||
    (day_diff < 7 && day_diff + " days ago") ||
    (day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago");
  return r;
}

const namaBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

type PostType = {
  title: string;
  content: string;
  imageType: string;
  eventDate: string;
  createdAt: string;
  user: {
    name: string;
  };
};

function Event() {
  const id = useParams().id;

  const [globalError, setGlobalError] = useState("");
  const [post, setPost] = useState<PostType | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch(`/api/event/${id}`, {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!response.ok) {
          setGlobalError("Failed to get event, please try again later.");
          return;
        }

        const res = await response.json();
        setPost(res.post);
        setEventDate(new Date(res.post.eventDate));
      } catch (error) {
        console.log(error);
        setGlobalError("A network error occurred. Please try again.");
        return;
      }
    }
    getPost();
  }, [id]);
  return (
    <section
      id='postContent'
      className='relative mx-auto flex h-[80dvh] w-[90vw] flex-col items-center justify-center overflow-hidden rounded-2xl border bg-bg-secondary/50 shadow-2xl md:w-[60vw]'
    >
      <div className='pointer-events-none absolute inset-0 linGrad opacity-70 -z-5' />
      <div className='relative z-10 flex w-full h-full flex-col overflow-y-auto overflow-x-hidden'>
        {globalError || !post ? (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-xl font-semibold'>
              There is nothing to see here
            </p>
          </div>
        ) : (
          <div className='flex flex-col w-full flex-1'>
            <div className='flex flex-row w-full py-5 px-8 justify-between items-start gap-4'>
              <div className='flex flex-col gap-1'>
                <h1 className='text-3xl font-bold text-shadow-lg'>
                  {post.title}
                </h1>
                <div className='flex justify-between text-base gap-4'>
                  <span className='text-accent'>{post.user.name}</span>
                  <span className='text-text-secondary'>
                    {prettyDate(new Date(post.createdAt))}
                  </span>
                </div>
              </div>
              <div className='flex-1 flex flex-col w-full justify-end items-center'>
                <div className='ml-auto w-fit'>
                  <h2 className='font-semibold'>Tanggal Acara:</h2>
                  <span className='text-amber-500 font-semibold'>
                    {eventDate!.getDate()} {namaBulan[eventDate!.getMonth()]}{" "}
                    {eventDate!.getFullYear()}
                  </span>
                </div>
              </div>
            </div>
            <hr className='mx-8' />
            {post?.imageType && (
              <div className='relative m-5 aspect-video rounded-2xl ring-1 z-0'>
                <Image
                  src={`/api/event/${id}/image`}
                  alt={post.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover rounded-2xl -z-1'
                />
              </div>
            )}
            <div className='m-5 md:mx-10 md:my-5'>
              {post.content.split("\n").map((val, idx) => (
                <p key={idx} className='text-base md:text-lg'>
                  {val}
                </p>
              ))}
              {/* <p className='text-base md:text-lg'>{post.content}</p> */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
export default Event;
