"use client";
import dynamic from "next/dynamic";
const ThreadCard = dynamic(() => import("@/components/cards/ThreadCard"));
import { FetchThreadByPagination } from "@/lib/actions/threads.actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import ThreadCardSkeleton from "@/components/Skeleton/ThreadCardSkeleton";
import { Spinner } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Thread, User } from "@prisma/client";

async function fetchData({ pageParam }: { pageParam: number }) {
  return JSON.parse(
    await FetchThreadByPagination({
      pageNumber: pageParam,
    })
  );
}

interface ThreadWithRelations extends Thread {
  author: User;
  children?: { author: { image: string } }[];
  likedBy: {
    name: string;
    id: string;
    username: string;
    image: string;
  }[];
}

interface fetchedPagesType {
  Threads: ThreadWithRelations[];
  isNext: boolean;
}

export default function Home() {
  const { ref, inView } = useInView({ threshold: 1 });

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["threads"],
      queryFn: fetchData,
      refetchOnWindowFocus: false,

      initialPageParam: 1,
      getNextPageParam: (prev: fetchedPagesType, next: fetchedPagesType[]) => {
        if (prev && next) {
          if (prev.isNext) {
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

  return (
    <section>
      <h1 className="head-text">Thread</h1>
      {!isLoading && data ? (
        <>
          {data.pages.map((Thread) => {
            return Thread.Threads.map((threadCard, i) => {
              return (
                <div
                  ref={i + 1 === Thread.Threads.length ? ref : undefined}
                  key={threadCard.id}
                >
                  <ThreadCard
                    id={threadCard.id}
                    likedBy={threadCard.likedBy}
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
                </div>
              );
            });
          })}
          <div className="w-full mt-5 flex items-center justify-center">
            {isFetchingNextPage && <Spinner className="mx-auto" />}
          </div>
        </>
      ) : (
        <ThreadCardSkeleton noOfCards={5} />
      )}
    </section>
  );
}
