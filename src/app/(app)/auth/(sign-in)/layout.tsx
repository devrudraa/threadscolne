import getAuthSession from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (session) redirect("/");
  return <>{children}</>;
}
