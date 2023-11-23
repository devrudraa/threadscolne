"use client";
import React, { FC } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session;
}
const Providers: FC<ProvidersProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
export default Providers;
