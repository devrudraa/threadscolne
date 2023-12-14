"use client";
import ChooseUsernameForm from "@/components/forms/ChooseUsernameForm";
import { FC } from "react";
import { Divider, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface pageProps {}
const Page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const { data, status, update } = useSession();

  if (status === "loading") return <LoadingScreen />;
  if (!data || !data.user) return null;
  if (data?.user.username) router.replace("/");

  return (
    <>
      <main className="grid place-items-center max-w-[100vw] min-h-[100vh] px-5 md:px-0 ">
        <main className="flex md:space-x-5 rounded-xl bg-stone-800 z-10 ">
          <section className="bg-dark-4 px-5 py-8 md:-translate-y-3 md:translate-x-3 rounded-xl shadow-md shadow-black drop-shadow-2xl space-y-5">
            <div className="w-[8rem] h-[8rem] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                alt="Profile Picture"
                className="rounded-md w-[8rem] mx-auto"
                width={200}
                height={200}
                src={data.user.image as string}
              />
            </div>

            <section className="space-y-5 max-w-[19rem] sm:min-w-[20rem]">
              <h1 className="text-heading3-bold tracking-wide">
                Choose username
              </h1>
              <label
                className="text-subtle-medium text-gray-300"
                htmlFor="heading"
              >
                {data.user.name} choose a username which uniquely identifies
                you.
              </label>
              <Divider />
              <ChooseUsernameForm update={update} userId={data?.user.id} />
            </section>
          </section>
        </main>
      </main>
    </>
  );
};
export default Page;

const LoadingScreen = () => {
  return (
    <section className="min-h-screen grid place-items-center">
      <Spinner />
    </section>
  );
};
