import PostThread from "@/components/forms/PostThread";
import { IsUserOnBoarded } from "@/lib/actions/utils.actions";
import getAuthSession from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession();
  if (!session) return null;

  if (!session.user || !session.user.id) return null;

  // const userOnBoarded = await IsUserOnBoarded({ userId: session.user.id });
  // if (!userOnBoarded) return redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text">Start a thread</h1>
      <PostThread userId={session.user.id} />
    </section>
  );
};
export default page;
