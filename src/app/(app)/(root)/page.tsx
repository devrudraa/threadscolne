import ThreadCard from "@/components/cards/ThreadCard";
import { FetchThreads } from "@/lib/actions/threads.actions";
import { IsUserOnBoarded } from "@/lib/actions/utils.actions";
import getAuthSession from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  // const userOnBoarded = await IsUserOnBoarded({
  //   userId: session?.user?.id as string,
  // });
  // if (!userOnBoarded) return redirect("/onboarding");

  const Threads = await FetchThreads({ pageNumber: 1, pageSize: 20 });

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
                  currentUser={session?.user.id!}
                  parentId={threadCard?.parentId}
                  content={threadCard.text}
                  // @ts-ignore
                  author={threadCard.author}
                  createdAt={threadCard.createdAt}
                  comments={threadCard.children}
                  username={threadCard.author.username as string}
                />
              );
            })}
          </>
        )}
      </section>
    </section>
  );
}
