import ThreadCard from "@/components/cards/ThreadCard";
import { FetchThreads } from "@/lib/actions/threads.actions";
import { IsUserOnBoarded } from "@/lib/actions/utils.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user || !user.id) return null;

  const userOnBoarded = await IsUserOnBoarded({ userId: user.id });
  if (!userOnBoarded) return redirect("/onboarding");

  const Threads = await FetchThreads({ pageNumber: 1, pageSize: 20 });

  // console.log(Threads.Threads);

  return (
    <section>
      <h1 className="head-text">Thread</h1>

      <section className="empty-9 flex flex-col gap-10">
        {Threads.Threads.length === 0 ? (
          <span className="no-result"></span>
        ) : (
          <>
            {Threads.Threads.map((threadCard) => {
              return (
                <ThreadCard
                  key={threadCard.id}
                  id={threadCard.id}
                  currentUser={user.id}
                  parentId={threadCard?.parentId}
                  content={threadCard.text}
                  author={threadCard.author}
                  createdAt={threadCard.createdAt}
                  comments={threadCard.children}
                />
              );
            })}
          </>
        )}
      </section>
    </section>
  );
}
