import { Button } from "@nextui-org/react";
import Image from "next/image";
import { FC } from "react";
import EditProfileModal from "../modal/EditProfile";
import Link from "next/link";

interface ProfileHeaderProps {
  paramsUserId: string;
  sessionUserId: string;
  name: string;
  username: string;
  imageUrl: string;
  bio: string | null;
}
const ProfileHeader: FC<ProfileHeaderProps> = ({
  paramsUserId,
  sessionUserId,
  bio,
  imageUrl,
  name,
  username,
}) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <div className="relative  w-11 h-11 object-cover">
            <Image
              src={imageUrl}
              fill
              alt="Image Profile photo"
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        {sessionUserId === paramsUserId && (
          <EditProfileModal
            id={sessionUserId}
            bio={bio}
            image={imageUrl}
            name={name}
            username={username}
          />
        )}
        {/* <Link href={"/settings/profile"}>settings</Link> */}
      </div>
      {/* {Todo Community} */}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full  bg-dark-3" />
    </div>
  );
};
export default ProfileHeader;
