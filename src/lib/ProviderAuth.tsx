import { ClerkProvider } from "@clerk/nextjs";
import { FC } from "react";

interface ProviderAuthProps {
  children: React.ReactNode;
}
const ProviderAuth: FC<ProviderAuthProps> = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
export default ProviderAuth;
