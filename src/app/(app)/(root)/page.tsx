import dynamic from "next/dynamic";
const ThreadCard = dynamic(() => import("@/components/cards/ThreadCard"));
import { FetchThreadByPagination } from "@/lib/actions/threads.actions";
// import getAuthSession from "@/lib/authOptions";

export default async function Home() {
  // const session = await getAuthSession();
  // if (!session) return null;
  // const userOnBoarded = await IsUserOnBoarded({
  //   userId: session?.user?.id as string,
  // });
  // if (!userOnBoarded) return redirect("/onboarding");

  const Threads = await FetchThreadByPagination({
    pageNumber: 1,
    pageSize: 20,
  });

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
                  // currentUser={session?.user.id!}
                  image={threadCard.image}
                  imageDesc={threadCard.imageDesc}
                  parentId={threadCard?.parentId}
                  content={threadCard.text}
                  author={threadCard.author}
                  createdAt={threadCard.createdAt}
                  comments={threadCard.children}
                  username={threadCard.author.username as string}
                  isDedicatedPage={false}
                />
              );
            })}
          </>
        )}
      </section>
    </section>
  );
}
