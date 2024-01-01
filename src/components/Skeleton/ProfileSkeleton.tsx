import { Spinner } from "@nextui-org/react";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="grid place-items-center min-h-full">
      <Spinner />
    </div>
  );
};
export default ProfileSkeleton;
