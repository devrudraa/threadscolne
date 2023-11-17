import React from "react";
import { Skeleton } from "../ui/skeleton";

const ThreadCardSkeleton = ({
  showComment = false,
}: {
  showComment?: boolean;
}) => {
  return (
    <>
      <div className="mt-10 gap-3 flex w-full rounded-xl bg-dark-2 p-5 py-10">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <div className="space-y-2">
            <Skeleton className="w-40 h-5" />
            <Skeleton className="w-80 h-5" />
            <Skeleton className="w-80 h-5" />
            <Skeleton className="w-80 h-5" />
          </div>

          <div className="flex gap-3 mt-5">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
          </div>
        </div>
      </div>
      {showComment && (
        <div className="comment-form justify-between">
          <div className="flex gap-3 items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-40 h-5 " />
          </div>
          <Skeleton className="w-24 h-10 rounded-full justify-self-end" />
        </div>
      )}
    </>
  );
};
export default ThreadCardSkeleton;
