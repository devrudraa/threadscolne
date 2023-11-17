import React from "react";
import { Skeleton } from "../ui/skeleton";
import ThreadCardSkeleton from "./ThreadCardSkeleton";

const HomePageSkeleton = () => {
  return (
    <div>
      <h1 className="head-text">Start a thread</h1>
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
    </div>
  );
};
export default HomePageSkeleton;
