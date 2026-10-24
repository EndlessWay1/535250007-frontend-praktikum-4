import { connection } from "next/server";
import { Suspense } from "react";
import Event from "./Event";

async function EventPageContent() {
  await connection();
  return <Event />;
}

function EventPage() {
  return (
    <section className='relative isolate h-dvh w-full flex items-center '>
      <div className='login-background fixed overflow-clip' />
      <Suspense
        fallback={
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg md:text-xl'>
            Loading ...
          </div>
        }
      >
        <EventPageContent />
      </Suspense>
    </section>
  );
}
export default EventPage;
