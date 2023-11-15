import AccountProfile from "@/components/forms/AccountProfile";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import { GetUserData } from "@/lib/actions/utils.actions";

const page = async () => {
  const user = await currentUser();

  if (!user || user.id) return null;
  const userInfo = await GetUserData({ userId: user?.id });

  const userData = {
    userId: user?.id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || userInfo?.name,
    bio: userInfo?.bio || "",
    profile_image: userInfo?.profile_photo || user.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete the profile to start using Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10 rounded-lg">
        {/* @ts-ignore */}
        <AccountProfile user={userData} btnTitle={"Continue"} />
      </section>
    </main>
  );
};
export default page;
