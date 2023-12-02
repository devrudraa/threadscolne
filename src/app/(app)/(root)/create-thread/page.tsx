import PostThread from "@/components/forms/PostThread";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = async ({}) => {
  // const session = await getAuthSession();
  // if (!session) return null;

  // const userOnBoarded = await IsUserOnBoarded({ userId: session.user.id });
  // if (!userOnBoarded) return redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text">Start a thread</h1>
      <PostThread />
    </section>
  );
};
export default page;
