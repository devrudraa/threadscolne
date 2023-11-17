import React from "react";
import { Skeleton } from "../ui/skeleton";

const CreateThreadSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="w-40 h-10" />
      <Skeleton className="w-20 h-5" />
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-full h-10" />
    </div>
  );
};
export default CreateThreadSkeleton;
