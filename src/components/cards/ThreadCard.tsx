"use client";
import { formatTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo } from "react";
import "@/styles/tiptap.css";
import { useRouter } from "next/navigation";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";

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
  createdAt: Date;
  username: string;
  comments?: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  isDedicatedPage: boolean;
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
  isDedicatedPage,
}) => {
  const router = useRouter();

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
                fill
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
            </section>
            {/* </Link> */}
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="Heart Like Icon"
                  height={24}
                  width={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src={"/assets/reply.svg"}
                    alt="reply Icon"
                    height={24}
                    width={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
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
                />
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
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
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
