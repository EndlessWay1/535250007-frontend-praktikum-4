import { connection } from "next/server";
import { Suspense } from "react";
import PostPageComponent from "./PostPageComponent";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

async function PostPageContent() {
  await connection();

  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  return <PostPageComponent />;
}

function PostPage() {
  return (
    <Suspense
      fallback={
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg md:text-xl'>
          Loading ...
        </div>
      }
    >
      <PostPageContent />
    </Suspense>
  );
}
export default PostPage;
