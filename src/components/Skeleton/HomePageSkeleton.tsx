import React from "react";
import ThreadCardSkeleton from "./ThreadCardSkeleton";

const HomePageSkeleton = () => {
  return (
    <div>
      <h1 className="head-text">Thread</h1>
      <ThreadCardSkeleton noOfCards={5} />
    </div>
  );
};
export default HomePageSkeleton;
