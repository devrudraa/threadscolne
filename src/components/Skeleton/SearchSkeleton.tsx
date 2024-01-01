import { Skeleton } from "@nextui-org/react";
import React from "react";

const SearchSkeleton = () => {
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <Skeleton className="w-full h-14 rounded-xl" />
    </section>
  );
};
export default SearchSkeleton;
