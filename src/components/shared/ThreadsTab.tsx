import { fetchUserPosts } from "@/lib/actions/threads.actions";
import { redirect } from "next/navigation";
import { FC } from "react";
import ThreadCard from "../cards/ThreadCard";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: "User" | "Community";
}
const ThreadsTab: FC<ThreadsTabProps> = async ({
  accountId,
  accountType,
  currentUserId,
}) => {
  const userThreads = await fetchUserPosts({ id: accountId });

  if (!userThreads) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {userThreads.map((thread) => {
        return (
          <ThreadCard
            key={thread.id}
            id={thread.id}
            author={thread.author}
            comments={thread.children}
            content={thread.text}
            createdAt={thread.createdAt}
            currentUser={currentUserId}
            parentId={thread.parentId}
          />
        );
      })}
    </section>
  );
};
export default ThreadsTab;
