import { fetchThreads } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs/server";
import ThreadCard from "../../components/shared/ThreadCard";

interface Thread {
  _id: string;
  text: string;
  parentId: string | null;
  author: { id: string; image: string; username: string };
  community: { id: string; name: string; image: string };
  createdAt: string;
  children: { author: { image: string } }[];
}
export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const { threads, isNext } = await fetchThreads({ page: 1, pageSize: 30 });

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-6">
        {threads && threads.length > 0 ? (
          threads.map((thread: Thread) => (
            <ThreadCard
              key={thread._id}
              id={thread._id}
              currentUserId={user.id}
              text={thread.text}
              author={thread.author}
              community={thread.community}
              createdAt={thread.createdAt}
              comments={thread.children}
              parentId={thread.parentId}
            />
          ))
        ) : (
          <p>No threads available.</p>
        )}
      </section>
    </>
  );
}
