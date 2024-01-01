"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "@/Constants";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // const { userId } = useAuth();
  const { status, data: session } = useSession();

  // if (status === "loading") {
  //   return <p>loading</p>;
  // }

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile" && status != "loading")
            link.route = `${link.route}/${session?.user.username}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${
                isActive ? "bg-primary-500" : "hover:bg-dark-4"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        {/* <p>sign in and out</p> */}
        <Button onClick={() => signOut()}>
          <div className="flex cursor-pointer gap-4 p-4 items-center">
            <p className="text-light-2 max-lg:hidden">Logout</p>
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
          </div>
        </Button>
        {/* <SignedIn> */}
        {/* <SignOutButton signOutCallback={() => router.push("/sign-in")}>
          </SignOutButton> */}
        {/* </SignedIn> */}
      </div>
    </section>
  );
};

export default LeftSidebar;
