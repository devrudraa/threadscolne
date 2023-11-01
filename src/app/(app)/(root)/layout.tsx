import BottomBar from "@/components/shared/Bottombar";
import LeftSideBar from "@/components/shared/Leftsidebar";
import RightSideBar from "@/components/shared/Rightsidebar";
import TopBar from "@/components/shared/Topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <main className="flex flex-row">
        <LeftSideBar />
        <section className="main-container">
          <div className="w-full max-w-4xl">{children}</div>
        </section>
        <RightSideBar />
      </main>
      <BottomBar />
    </>
  );
}
