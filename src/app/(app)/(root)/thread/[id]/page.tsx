import ThreadCard from "@/components/cards/ThreadCard";
import CommentForm from "@/components/forms/Comment";
import { FetchThreadById } from "@/lib/actions/threads.actions";
import { IsUserOnBoarded } from "@/lib/actions/utils.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: { id: string };
}
const Page: FC<pageProps> = async ({ params }) => {
  const user = await currentUser();
  if (!params.id || !user) return null;

  const userOnBoarded = await IsUserOnBoarded({ userId: user.id });

  if (!userOnBoarded) return redirect("/onboarding");

  const thread = await FetchThreadById(params.id);
  if (!thread) return null;

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread.id}
          id={thread.id}
          currentUser={thread.id}
          parentId={thread?.parentId}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <CommentForm
          threadId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={user.id}
        />
      </div>

      <div className="mt-10 ">
        {thread.children.map((childItem) => {
          return (
            <ThreadCard
              key={childItem.id}
              id={childItem.id}
              currentUser={childItem.id}
              parentId={childItem?.parentId}
              content={childItem.text}
              author={childItem.author}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              isComment={true}
            />
          );
        })}
      </div>
    </section>
  );
};
export default Page;
