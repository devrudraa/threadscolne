import ThreadCard from "@/components/cards/ThreadCard";
import CommentForm from "@/components/forms/Comment";
import { FetchThreadById } from "@/lib/actions/threads.actions";
import getAuthSession from "@/lib/authOptions";
import { FC } from "react";

interface pageProps {
  params: { id: string };
}
const Page: FC<pageProps> = async ({ params }) => {
  const session = await getAuthSession();
  if (!params.id || !session) return null;

  // const userOnBoarded = await IsUserOnBoarded({ userId: session.user.id });
  // if (!userOnBoarded) return redirect("/onboarding");

  const thread = await FetchThreadById(params.id);
  if (!thread) return null;

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread.id}
          id={thread.id}
          // currentUser={thread.id}
          parentId={thread?.parentId}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
          username={thread.author.username as string}
        />
      </div>
      <div className="mt-7">
        <CommentForm
          threadId={params.id}
          currentUserImg={session.user.image as string}
          currentUserId={session.user.id}
        />
      </div>

      <div className="mt-10 ">
        {thread.children.map((childItem) => {
          return (
            <ThreadCard
              key={childItem.id}
              id={childItem.id}
              // currentUser={childItem.id}
              parentId={childItem?.parentId}
              content={childItem.text}
              author={childItem.author}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              isComment={true}
              username={childItem.author.username as string}
            />
          );
        })}
      </div>
    </section>
  );
};
export default Page;
