"use client";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TopBar = () => {
  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items-center gap-4">
        <Image
          src={"/assets/logo.svg"}
          height={35}
          width={35}
          alt="Logo Image"
        />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">
          Code Flow
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          {/* <Button>Sign in sign out</Button> */}
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
          {/* <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src={"/assets/logout.svg"}
                  alt="Logout Logo"
                  width={28}
                  height={28}
                />
              </div>
            </SignOutButton>
          </SignedIn> */}
        </div>

        {/* <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        /> */}
        {/* <Button>Organization switch</Button> */}
      </div>
    </nav>
  );
};
export default TopBar;
