import { currentUser } from "@clerk/nextjs/server";
import { fetchThread } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import ThreadCard from "@/components/shared/ThreadCard";
import CommentForm from "@/components/shared/CommentForm";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userValues = await fetchUser(user?.id);
  if (!userValues?.onboarded) {
    redirect("/onboarding");
  }
  const { id } = await params;
  const thread = await fetchThread(id);

  if (!thread) {
    return <p>Thread not found</p>;
  }

  return (
    <>
      {thread ? (
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          text={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          parentId={thread.parentId}
        />
      ) : (
        <p>Loadng...</p>
      )}
      <CommentForm
        threadId={thread._id.toString()}
        currentUserImage={user.imageUrl}
        currentUserId={userValues._id.toString()}
      />
      <div className="mt-6">
      {thread.children.map((comment: any) => (
        <ThreadCard
          id={comment._id}
          currentUserId={user.id}
          text={comment.text}
          author={comment.author}
          community={comment.community}
          createdAt={comment.createdAt}
          comments={comment.children}
          parentId={comment.parentId}
          key={comment._id}
          isComment={true} />
      ))}
      </div>
    </>
  );
};

export default page;
