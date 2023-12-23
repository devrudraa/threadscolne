import { fetchUserPosts } from "@/lib/actions/threads.actions";
import { FC } from "react";
import ThreadCard from "../cards/ThreadCard";
import { Divider } from "@nextui-org/react";

interface ThreadsTabProps {
  currentUserId: string;
  id: string;
}
const ThreadsTab: FC<ThreadsTabProps> = async ({ id, currentUserId }) => {
  const userThreads = await fetchUserPosts({ id: id });

  return (
    <section className="mt-9 flex flex-col gap-10">
      {userThreads.map((thread) => {
        return (
          <>
            <Divider />
            <ThreadCard
              key={thread.id}
              id={thread.id}
              author={thread.author}
              content={thread.text}
              createdAt={thread.createdAt}
              // currentUser={currentUserId}
              parentId={thread.parentId}
              username={thread.author.username as string}
              isDedicatedPage={false}
            />
          </>
        );
      })}
    </section>
  );
};
export default ThreadsTab;
