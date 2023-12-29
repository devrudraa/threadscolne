"use client";
import React, { FC } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Provider } from "react-redux";
import { store } from "./Store/Store";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session;
}
const Providers: FC<ProvidersProps> = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
};
export default Providers;
