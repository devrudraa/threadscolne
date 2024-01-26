"use client";
import { fetchUserPosts } from "@/lib/actions/threads.actions";
import { FC, useEffect } from "react";
import dynamic from "next/dynamic";
const ThreadCard = dynamic(() => import("@/components/cards/ThreadCard"));
import { Divider, Spinner } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import ThreadCardSkeleton from "../Skeleton/ThreadCardSkeleton";

interface ThreadsTabProps {
  currentUserId: string;
  id: string;
}

async function fetchData({ pageParam, id }: { pageParam: number; id: string }) {
  return await fetchUserPosts({ id: id });
}

const ThreadsTab: FC<ThreadsTabProps> = ({ id, currentUserId }) => {
  // const userThreads = await fetchUserPosts({ id: id });

  const { ref, inView } = useInView({ threshold: 1 });

  const {
    data: userThreads,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["threads"],
    queryFn: (e) => fetchData({ id: id, pageParam: e.pageParam }),
    initialPageParam: 1,
    getNextPageParam: (prev, next) => {
      if (prev && next) {
        if (prev?.isNext) {
          return next.length + 1;
        } else {
          return undefined;
        }
      }
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const Threads = userThreads?.pages.map((e) => e);

  if (!Threads) {
    return null;
  }

  if (isLoading) {
    return <ThreadCardSkeleton noOfCards={5} />;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {!isLoading && Threads ? (
        Threads.map((thread) => {
          if (!thread) return null;
          return thread.userThread.map((showThread, i) => {
            return (
              <div
                ref={i + 1 === thread.userThread.length ? ref : undefined}
                key={showThread.id}
              >
                <ThreadCard
                  likedBy={showThread.likedBy}
                  image={showThread.image}
                  imageDesc={showThread.imageDesc}
                  id={showThread.id}
                  author={showThread.author}
                  content={showThread.text}
                  createdAt={showThread.createdAt}
                  // currentUser={currentUserId}
                  parentId={showThread.parentId}
                  username={showThread.author.username as string}
                  isDedicatedPage={false}
                />
                <Divider />
              </div>
            );
          });
        })
      ) : (
        <div className="w-full mt-5 flex items-center justify-center">
          {isFetchingNextPage && <Spinner className="mx-auto" />}
        </div>
      )}
    </section>
  );
};
export default ThreadsTab;
