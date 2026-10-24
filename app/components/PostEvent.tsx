"use client";
import Image from "next/image";

type PostEventPropsType = {
  id: string;
  title: string;
  content: string;
  imageType?: string;
  eventDate: Date;
  createdAt: Date;
  user: { name: string | null };
};

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

function PostEvent({
  id,
  title,
  content,
  eventDate,
  createdAt,
  imageType,
  user,
}: PostEventPropsType) {
  let newContent = content.split("\n")[0];
  if (newContent.length > 30) {
    newContent = newContent.substring(0, 30) + " ...";
  }

  console.log(typeof eventDate);
  console.log(eventDate);
  return (
    <article className='flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl bg-bg-secondary shadow-2xl hover:scale-103 transition-transform duration-300 ease-in-out'>
      {imageType && (
        <div className='relative aspect-video w-full'>
          <Image
            src={`/api/event/${id}/image`}
            alt={title}
            fill
            sizes='(max-width: 640px) 100vw, 33vw'
            className='object-cover'
          />
        </div>
      )}
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex flex-row items-start justify-between gap-2'>
          <h1 className='min-w-0 wrap-break-word font-semibold text-lg md:text-xl'>
            {title}
          </h1>
          <span className='shrink-0 text-sm'>
            {eventDate.getDate()} {namaBulan[eventDate.getMonth()]}{" "}
            {eventDate.getFullYear()}
          </span>
        </div>
        <hr />
        <p className='line-clamp-3 wrap-break-word text-text-secondary text-base'>
          {newContent}
        </p>
        <div className='mt-auto flex flex-row justify-between text-sm'>
          <span className='text-accent'>{user.name ?? "Anonymous"}</span>
          <span className='text-yellow-500'>
            {createdAt.getDate()}/{createdAt.getMonth() + 1}/
            {createdAt.getFullYear().toString().slice(-2)}
          </span>
        </div>
      </div>
    </article>
  );
}
export default PostEvent;
