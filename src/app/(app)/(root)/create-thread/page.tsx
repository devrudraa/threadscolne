import PostThread from "@/components/forms/PostThread";
import { IsUserOnBoarded } from "@/lib/actions/utils.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = async ({}) => {
  const user = await currentUser();
  if (!user || !user.id) return null;

  const userOnBoarded = await IsUserOnBoarded({ userId: user.id });
  if (!userOnBoarded) return redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text">Start a thread</h1>
      <PostThread userId={user.id} />
    </section>
  );
};
export default page;
