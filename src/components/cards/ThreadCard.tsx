import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ThreadCardProps {
  id: string;
  currentUser: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    profile_photo: string;
    userId: string;
    username?: string;
  };
  createdAt: Date;
  //   comments: {
  //     author: {
  //       profile_photo: true;
  //     };
  //   }[];
  //   comments: ({ author: { profile_photo: string } } & {
  //     id: string;
  //     text: string;
  //     createdAt: Date;
  //     parentId: string | null;
  //     userUserId: string;
  //     threadId: string | null;
  //   })[];
  comments: any[];
  isComment?: boolean;
}
const ThreadCard: FC<ThreadCardProps> = ({
  author,
  comments,
  content,
  createdAt,
  currentUser,
  id,
  parentId,
  isComment,
}) => {
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
              href={`/profile/${author.userId}`}
              className="relative h-11 w-11"
            >
              <Image
                src={author.profile_photo}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col ">
            <Link href={`/profile/${author.userId}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <Link href={`/thread/${id}`} className="w-fit">
              <p className="mt-2 text-small-regular text-light-2">{content}</p>
            </Link>
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

              {isComment && comments.length > 0 && (
                <p className="mt-1 text-subtle-medium text-gray-1">
                  {comments.length} Replies{" "}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
export default ThreadCard;
