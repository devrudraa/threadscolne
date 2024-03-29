"use client";
import { fetchUserPosts } from "@/lib/actions/threads.actions";
import { FC, useEffect } from "react";
import dynamic from "next/dynamic";
const ThreadCard = dynamic(() => import("@/components/cards/ThreadCard"));
import { Divider, Spinner } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import ThreadCardSkeleton from "../Skeleton/ThreadCardSkeleton";
import Alert from "./Alert";

async function fetchData({
  pageParam,
  id,
  isFetchingReplies,
}: {
  pageParam: number;
  id: string;
  isFetchingReplies: boolean;
}) {
  return await fetchUserPosts({
    id: id,
    pageNumber: pageParam,
    isFetchingReplies,
  });
}

interface ThreadsTabProps {
  isFetchingReplies: boolean;
  currentUserId: string;
  tab: string;
  id: string;
}
const ThreadsTab: FC<ThreadsTabProps> = ({
  id,
  currentUserId,
  tab,
  isFetchingReplies,
}) => {
  const { ref, inView } = useInView({ threshold: 1 });

  const {
    data: userThreads,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [tab],
    queryFn: async (e) =>
      await fetchData({ id: id, pageParam: e.pageParam, isFetchingReplies }),
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

  const Threads = userThreads?.pages.reduce((e) => e);

  if (!Threads) {
    return null;
  }

  if (isLoading) {
    return <ThreadCardSkeleton noOfCards={5} />;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {!isLoading && Threads ? (
        Threads.userThread.length > 0 ? (
          Threads.userThread.map((showThread, i) => {
            return (
              <div
                ref={i + 1 === Threads.userThread.length ? ref : undefined}
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
                <Divider className="mt-3" />
              </div>
            );
          })
        ) : (
          <Alert message="No thread found" />
        )
      ) : (
        <div className="w-full mt-5 flex items-center justify-center">
          {isFetchingNextPage && <Spinner className="mx-auto" />}
        </div>
      )}
    </section>
  );
};
export default ThreadsTab;
