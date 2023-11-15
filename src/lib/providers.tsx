import React, { FC } from "react";
import ProviderAuth from "./ProviderAuth";

interface ProvidersProps {
  children: React.ReactNode;
}
const Providers: FC<ProvidersProps> = ({ children }) => {
  return <ProviderAuth>{children}</ProviderAuth>;
};
export default Providers;
