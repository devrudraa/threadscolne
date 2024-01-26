"use client";
import { formatTimeAgo } from "@/lib/utils";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import "@/styles/tiptap.css";
import { useRouter } from "next/navigation";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { useSession } from "next-auth/react";
import ThreadCardSkeleton from "../Skeleton/ThreadCardSkeleton";
import { likeUnLike } from "@/lib/actions/threads.actions";
import { Dot } from "lucide-react";
import ShowLikedPerson from "../modal/ShowLikedPerson";

interface ThreadCardProps {
  id: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
    username?: string | null;
  };
  createdAt: string | Date;
  username: string;
  comments?: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  isDedicatedPage: boolean;
  image: string | null;
  imageDesc: string | null;
  likedBy: {
    id: string;
    name: string;
    username: string | null;
    image: string;
  }[];
}
const ThreadCard: FC<ThreadCardProps> = ({
  author,
  comments,
  content,
  createdAt,
  id,
  parentId,
  username,
  isComment,
  image,
  likedBy,
  imageDesc = "",
  isDedicatedPage,
}) => {
  const router = useRouter();
  const { data, status } = useSession();
  const [isThreadLiked, setIsThreadLiked] = useState<{
    status: boolean | "loading";
  }>({ status: likedBy.some((obj) => obj.id === data?.user.id) });
  const [likeCount, setLikeCount] = useState<number>(likedBy.length);

  const extensions = useMemo(() => [StarterKit], []);
  const editorProps = useMemo(
    () => ({
      attributes: {
        spellcheck: "true",
      },
    }),
    []
  );
  const editor = useEditor({
    extensions,
    editorProps,
    editable: false,
    content: content,
  });

  if (status === "loading") {
    return <ThreadCardSkeleton />;
  }

  async function likeButtonClicked() {
    setIsThreadLiked({ status: "loading" });
    //* for instead feedback
    const initialState = {
      count: likeCount,
      likeStatus: isThreadLiked,
    };

    if (isThreadLiked.status) {
      setLikeCount((prev) => prev - 1);
      setIsThreadLiked({ status: false });
    } else {
      setLikeCount((prev) => prev + 1);
      setIsThreadLiked({ status: true });
    }

    // * Now actually updating it in the db
    const result = await likeUnLike({ threadId: id, userId: data?.user.id! });
    if (result?.error) {
      setLikeCount(initialState.count);
      setIsThreadLiked({
        status: initialState.likeStatus.status,
      });
    }
  }

  return (
    <article
      className={`mt-10 flex w-full flex-col rounded-xl  ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author.username}`}
              className="relative h-11 w-11"
            >
              <Image
                src={author.image}
                alt="Profile Image"
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col ">
            <Link
              href={`/profile/${author.username}`}
              className="w-fit flex flex-col"
            >
              <div className="flex gap-1 items-center">
                <h4 className="cursor-pointer text-base-semibold text-light-1">
                  {author.name}
                </h4>
                <span className="mb-2">.</span>
                <p className="text-subtle-medium text-light-4">
                  {formatTimeAgo(createdAt)}
                </p>
              </div>
              <label className="text-tiny-medium">@{username}</label>
            </Link>
            {/* <Link href={`/thread/${id}`} className="w-fit"> */}
            <section
              onClick={() => !isDedicatedPage && router.push(`/thread/${id}`)}
              className={`mt-2 text-small-regular text-light-2 tiptap ${
                !isDedicatedPage && "cursor-pointer"
              }`}
            >
              <EditorContent editor={editor} />

              {content.length > 100 && !isDedicatedPage && (
                <Link href={`/thread/${id}`} className="text-primary-500">
                  ...
                  <label
                    htmlFor="link"
                    className="hover:underline cursor-pointer"
                  >
                    read more
                  </label>
                </Link>
              )}
              {image && (
                <Image
                  src={image}
                  width={400}
                  className="rounded-lg mx-auto mt-5 mb-5"
                  height={400}
                  alt={imageDesc ? imageDesc : ""}
                />
              )}
            </section>
            {/* </Link> */}
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <div
                  className={`flex items-center text-subtle-medium font-thin ${
                    isThreadLiked.status === "loading" && "opacity-25"
                  }`}
                >
                  <button
                    onClick={likeButtonClicked}
                    disabled={isThreadLiked.status === "loading"}
                    className="relative group"
                  >
                    <div className="w-8 h-8 bg-red-500/10 rounded-full absolute transform translate-x-1/2 -translate-y-[55%] top-1/2 right-1/2 opacity-0 group-hover:opacity-100" />
                    <Image
                      src={`/assets/heart-${
                        isThreadLiked.status === true ? "filled" : "gray"
                      }.svg`}
                      alt="Heart Like Icon"
                      height={24}
                      width={24}
                      title={`${
                        isThreadLiked.status ? "I dislike this" : "I like this"
                      }`}
                      className="cursor-pointer object-contain "
                    />
                  </button>
                  <Dot size={12} />
                  {likeCount > 0 ? (
                    <ShowLikedPerson threadId={id} likeCount={likeCount} />
                  ) : (
                    <button
                      title="View who liked"
                      // onClick={() => }
                    >
                      {likeCount}
                    </button>
                  )}
                </div>
                <Link
                  href={`/thread/${id}`}
                  className="flex items-center text-subtle-medium font-thin gap-2"
                >
                  <Image
                    src={"/assets/reply.svg"}
                    alt="reply Icon"
                    height={24}
                    width={24}
                    title="Comments"
                    className="cursor-pointer object-contain"
                  />
                  {comments?.length}
                </Link>
                {/* <Image
                  src={"/assets/repost.svg"}
                  alt="repost Icon"
                  height={24}
                  width={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/share.svg"}
                  alt="share Icon"
                  height={24}
                  width={24}
                  className="cursor-pointer object-contain"
                /> */}
              </div>

              {comments && isComment && comments.length > 0 && (
                <p className="mt-1 text-subtle-medium text-gray-1">
                  {comments.length} Replies{" "}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* //* Adding the image of the person who replied */}
      {!isComment && comments && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${
                index !== 0 && "-ml-5"
              } rounded-full object-cover w-full`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
    </article>
  );
};
export default ThreadCard;
