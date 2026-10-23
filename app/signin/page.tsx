import EmailPasswordComponent from "./EmailPasswordComponent";
import { Suspense } from "react";
import { connection } from "next/server";

// export const instant = false;

async function EmailPasswordContent() {
  await connection();

  return <EmailPasswordComponent />;
}

export default async function EmailPasswordPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl'>
            Loading ...
          </div>
        }
      >
        <EmailPasswordContent />
      </Suspense>
    </>
  );
}
