// import PostThread from "@/components/forms/PostThread";
import { FC } from "react";
import CreateThread from "@/components/forms/CreateThread";
import getAuthSession from "@/lib/authOptions";

interface pageProps {}
const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession();
  if (!session) return null;

  // const userOnBoarded = await IsUserOnBoarded({ userId: session.user.id });
  // if (!userOnBoarded) return redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text">Start a thread</h1>
      <CreateThread authorId={session.user.id} />
      {/* <PostThread /> */}
    </section>
  );
};
export default page;
