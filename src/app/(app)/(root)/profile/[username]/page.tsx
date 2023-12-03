import { FC, Suspense } from "react";
import Image from "next/image";
import { profileTabs } from "@/Constants";
import { redirect } from "next/navigation";
import getAuthSession from "@/lib/authOptions";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { GetUserData } from "@/lib/actions/utils.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadCardSkeleton from "@/components/Skeleton/ThreadCardSkeleton";

interface pageProps {
  params: { username: string };
}
const Page: FC<pageProps> = async ({ params }) => {
  const session = await getAuthSession();
  if (!session) return null;

  const userData = await GetUserData({ username: params.username });
  // if (!userData) return redirect("/auth/sign-in");

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
              {tab.value === "tagged" ? (
                <p>tagged threads</p>
              ) : (
                <Suspense fallback={<ThreadCardSkeleton noOfCards={5} />}>
                  <ThreadsTab
                    currentUserId={session.user.id}
                    id={userData.id}
                  />
                </Suspense>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  ) : (
    <p className="no-result">User not found</p>
  );
};
export default Page;
