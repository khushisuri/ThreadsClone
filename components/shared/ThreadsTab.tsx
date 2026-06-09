import { fetchUserPosts } from "@/lib/actions/thread.action";
import React from "react";
import ThreadCard from "./ThreadCard";

const ThreadsTab = async ({
  currentUserId,
  accountId,
  isUser,
}: {
  currentUserId: string;
  accountId: string;
  isUser?: boolean | undefined;
}) => {
  
  const threads =  await fetchUserPosts(accountId);


  return <div>
    <div className="mt-6">
      {threads.map((thread: any) => (
        <ThreadCard
          id={thread._id}
          currentUserId={currentUserId}
          text={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          parentId={thread.parentId}
          key={thread._id} />
      ))}
      </div>
  </div>;
};

export default ThreadsTab;
