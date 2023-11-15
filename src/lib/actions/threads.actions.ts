"use server";
import { revalidatePath } from "next/cache";
import prisma from "../PrismaClient";

interface ThreadsParams {
  text: string;
  authorId: string;
  communityId?: string;
  path: string;
}

export async function CreateThread({
  authorId,
  communityId,
  text,
  path,
}: ThreadsParams): Promise<void> {
  const createdThread = await prisma.thread.create({
    data: {
      text: text,
      author: {
        connect: { userId: authorId },
      },
    },
  });

  await prisma.user.update({
    where: { userId: authorId },
    data: {
      Thread: { connect: { id: createdThread.id } },
    },
  });

  revalidatePath(path);
}

//* ---------------------------------------------------------------FetchThreads()------------------------------------------------

interface FetchThreadsProps {
  pageNumber: number;
  pageSize: number;
}

export async function FetchThreads({
  pageNumber,
  pageSize,
}: FetchThreadsProps) {
  const SkipAmount = (pageNumber - 1) * pageSize;

  const Threads = await prisma.thread.findMany({
    where: {
      parentId: null,
    },
    take: pageSize,
    skip: SkipAmount,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          profile_photo: true,
          userId: true,
          username: true,
        },
      },

      children: {
        include: {
          author: {
            select: {
              profile_photo: true,
            },
          },
        },
      },
    },
  });

  const totalResults = await prisma.thread.findMany({
    where: {
      parentId: null,
    },
    include: {
      _count: true,
    },
  });

  const isNext = totalResults.length > SkipAmount + Threads?.length;
  return { Threads, isNext };
}

//* ---------------------------------------------------------------FetchThreadById()------------------------------------------------
export async function FetchThreadById(threadId: string) {
  return await prisma.thread.findFirst({
    where: {
      id: threadId,
    },
    include: {
      author: {
        select: {
          name: true,
          profile_photo: true,
          userId: true,
          username: true,
        },
      },
      children: {
        include: {
          author: {
            select: {
              name: true,
              profile_photo: true,
              userId: true,
              username: true,
            },
          },
          children: {
            select: {
              parent: true,
              author: {
                select: {
                  name: true,
                  profile_photo: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

//* ----------------------------------------------------------------addCommentToThread()----------------------------------------------------------------

interface addCommentToThreadProps {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function addCommentToThread({
  commentText,
  path,
  threadId,
  userId,
}: addCommentToThreadProps) {
  const originalThread = await prisma.thread.findFirst({
    where: {
      id: threadId,
    },
  });
  if (!originalThread) throw new Error("Could not find thread");

  const addCommentToThread = await prisma.thread.update({
    where: {
      id: threadId,
    },
    data: {
      children: {
        create: {
          parentId: threadId,
          text: commentText,
          author: {
            connect: {
              userId: userId,
            },
          },
        },
      },
    },
  });

  revalidatePath(path);
  //   const commentThread = prisma.thread.create({
  //     data: {
  //       parentId: threadId,
  //       text: commentText,
  //       author: {
  //         connect: {
  //           userId: userId,
  //         },
  //       },
  //     },
  //   });
}

//* ---------------------------------------------------------------fetchUserPosts()------------------------------------------------

interface fetchUserPostsProps {
  userId: string;
}

export async function fetchUserPosts({ userId }: fetchUserPostsProps) {
  const userThread = prisma.thread.findMany({
    where: {
      author: {
        userId: userId,
      },
    },
    include: {
      children: true,
      author: {
        select: {
          name: true,
          profile_photo: true,
          userId: true,
        },
      },
    },
  });
  return userThread;
}
