"use client";
import { FC, useEffect } from "react";
import dynamic from "next/dynamic";
const ThreadCard = dynamic(() => import("@/components/cards/ThreadCard"));
import { Divider, Spinner } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import ThreadCardSkeleton from "../Skeleton/ThreadCardSkeleton";
import { fetchUserLikedPosts } from "@/lib/actions/user.actions";
import Alert from "./Alert";

async function fetchData({ pageParam, id }: { pageParam: number; id: string }) {
  return await fetchUserLikedPosts({
    id: id,
    pageNumber: pageParam,
  });
}

interface userLikedThreadsProps {
  currentUserId: string;
  tab: string;
  id: string;
}
const UserLikedThreads: FC<userLikedThreadsProps> = ({
  id,
  currentUserId,
  tab,
}) => {
  const { ref, inView } = useInView({ threshold: 1 });

  const {
    data: userThreads,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [tab],
    queryFn: async (e) => await fetchData({ id: id, pageParam: e.pageParam }),
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
        Threads.likedThreads.length > 0 ? (
          Threads.likedThreads.map((thread, i) => {
            if (!thread) return null;
            return (
              <div
                ref={i + 1 === Threads.likedThreads.length ? ref : undefined}
                key={thread.id}
              >
                <ThreadCard
                  likedBy={thread.likedBy}
                  image={thread.image}
                  imageDesc={thread.imageDesc}
                  id={thread.id}
                  author={thread.author}
                  content={thread.text}
                  createdAt={thread.createdAt}
                  // currentUser={currentUserId}
                  parentId={thread.parentId}
                  username={thread.author.username as string}
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
export default UserLikedThreads;
