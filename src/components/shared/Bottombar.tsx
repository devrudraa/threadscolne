"use client";
import { sidebarLinks } from "@/Constants";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link, index) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 0) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={index}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                width={24}
                height={24}
                src={link.imgURL}
                alt={link.label}
              />
              <p className="text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
export default BottomBar;
