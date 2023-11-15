import ProfileHeader from "@/components/shared/ProfileHeader";
import { GetUserData, IsUserOnBoarded } from "@/lib/actions/utils.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { profileTabs } from "@/Constants";
import ThreadsTab from "@/components/shared/ThreadsTab";

interface pageProps {
  params: { userId: string };
}
const Page: FC<pageProps> = async ({ params }) => {
  const user = await currentUser();
  if (!user || !user.id) return null;

  const userData = await GetUserData({ userId: params.userId });
  if (!userData?.bio || !userData) return redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        accountId={params.userId}
        authUserId={user.id}
        bio={userData?.bio}
        imageUrl={userData.profile_photo}
        name={userData.name}
        username={userData.username}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userData.Thread.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              {/* @ts-ignore */}
              <ThreadsTab
                currentUserId={user.id}
                accountId={params.userId}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
export default Page;
