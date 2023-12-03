import BottomBar from "@/components/shared/Bottombar";
import LeftSideBar from "@/components/shared/Leftsidebar";
import RightSideBar from "@/components/shared/Rightsidebar";
import TopBar from "@/components/shared/Topbar";
import getAuthSession from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) redirect("/auth/sign-in");
  if (!session.user.username) redirect("/username");
  return (
    <>
      <TopBar />
      <main className="flex flex-row">
        <LeftSideBar />
        <section className="main-container">
          <div className="w-full max-w-4xl">{children}</div>
        </section>
        {/* <RightSideBar /> */}
      </main>
      <BottomBar />
    </>
  );
}
