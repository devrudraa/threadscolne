import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TopBar = () => {
  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items-center gap-4">
        <Image
          src={"/assets/logo.svg"}
          height={29}
          width={28}
          alt="Logo Image"
        />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <Button>Sign in sign out</Button>
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
        <Button>Organization switch</Button>
      </div>
    </nav>
  );
};
export default TopBar;
