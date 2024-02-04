import { FC, Suspense } from "react";
import Image from "next/image";
import { profileTabs } from "@/Constants";
import getAuthSession from "@/lib/authOptions";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { GetUserData } from "@/lib/actions/utils.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadCardSkeleton from "@/components/Skeleton/ThreadCardSkeleton";
import UserLikedThreads from "@/components/shared/UserThreadsLiked";

interface pageProps {
  params: { username: string };
}
const Page: FC<pageProps> = async ({ params }) => {
  const session = await getAuthSession();
  if (!session) return null;

  const userData = await GetUserData({ username: params.username });
  const yourThreadsCount = userData?.Thread.filter((e) => e.parentId === null);
  const repliedThreadsCount = userData?.Thread.filter(
    (e) => e.parentId != null
  );

  return userData ? (
    <section>
      <ProfileHeader
        paramsUserId={userData.id}
        sessionUserId={session.user.id}
        bio={userData?.bio}
        imageUrl={userData.image}
        name={userData.name}
        username={userData.username!}
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
                    {yourThreadsCount?.length}
                  </p>
                )}
                {tab.label === "Replies" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {repliedThreadsCount?.length}
                  </p>
                )}
                {tab.label === "Liked" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userData?.likedThreads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <Suspense fallback={<ThreadCardSkeleton />}>
            {profileTabs.map((tab) => (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className="w-full text-light-1"
              >
                {tab.value === "liked" ? (
                  <UserLikedThreads
                    tab={tab.value}
                    currentUserId={session.user.id}
                    id={userData.id}
                  />
                ) : (
                  <ThreadsTab
                    tab={tab.value}
                    isFetchingReplies={tab.value === "replies" ? true : false}
                    currentUserId={session.user.id}
                    id={userData.id}
                  />
                )}
              </TabsContent>
            ))}
          </Suspense>
        </Tabs>
      </div>
    </section>
  ) : (
    <p className="no-result">User not found</p>
  );
};
export default Page;
