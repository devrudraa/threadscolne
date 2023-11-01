"use client";
import { sidebarLinks } from "@/Constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn } from "@clerk/nextjs";

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar ">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link, index) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 0) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={index}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                width={24}
                height={24}
                src={link.imgURL}
                alt={link.label}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("sign-in")}>
            <div className="flex cursor-pointer gap-4 px-4">
              <Image
                src={"/assets/logout.svg"}
                alt="Logout Logo"
                width={28}
                height={28}
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};
export default LeftSideBar;
