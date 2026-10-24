import { connection } from "next/server";
import { Suspense } from "react";
import EventPageComponent from "./EventPageComponent";

async function EventPageContent() {
  await connection();
  return <EventPageComponent />;
}

function EventPage() {
  return (
    <>
      <div className='bg-bg h-[60vh] fixed top-0 -translate-y-1/2 z-5 w-full'></div>
      <section
        id='event'
        className='relative w-full h-dvh flex flex-col justify-center items-center'
      >
        <div className='w-[90vw] md:w-[60vw] h-[60vh]'>
          <div className='flex gap-2 flex-col fixed border-b w-[90vw] md:w-[60vw] bg-bg z-5 '>
            <span className='linGrad -mb-2 bg-clip-text text-transparent text-lg'>
              In GKI Perumahan Citra 1
            </span>
            <h1 className='font-bold text-2xl md:text-3xl '>
              Currents Event&apos;s
            </h1>
          </div>
          <Suspense
            fallback={
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg md:text-xl'>
                Loading ...
              </div>
            }
          >
            <EventPageContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}
export default EventPage;
