"use server";
import { revalidatePath } from "next/cache";
import prisma from "../PrismaClient";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import { dataURLtoFile, isBase64Image } from "../utils";
import { useUploadThing } from "../uploadthing";

interface ThreadsParams {
  text: string;
  authorId: string;
  path: string;
  image?: string;
  desc?: string;
}

export async function AddThread({
  authorId,
  text,
  path,
  desc,
  image,
}: ThreadsParams): Promise<boolean> {
  const createdThread = await prisma.thread.create({
    data: {
      text: text,
      image: image,
      imageDesc: desc,
      author: {
        connect: { id: authorId },
      },
    },
  });

  await prisma.user.update({
    where: { id: authorId },
    data: {
      Thread: { connect: { id: createdThread.id } },
    },
  });

  revalidatePath(path);
  return true;
}

//* ---------------------------------------------------------------FetchThreads()------------------------------------------------
// This is used on the home page where you have to display only a number of threads
interface FetchThreadsProps {
  pageNumber?: number;
  pageSize?: number;
}

export async function FetchThreadByPagination({
  pageNumber = 1,
  pageSize = 10,
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
          image: true,
          id: true,
          username: true,
        },
      },

      children: {
        include: {
          author: {
            select: {
              image: true,
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
  return JSON.stringify({ Threads, isNext });
}

//* ---------------------------------------------------------------FetchThreadById()------------------------------------------------
// This is used on the dedicated thread page where you have to give all the info of one thread

export async function FetchThreadById(threadId: string) {
  return await prisma.thread.findFirst({
    where: {
      id: threadId,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          id: true,
          username: true,
        },
      },
      children: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              id: true,
              username: true,
            },
          },
          children: {
            select: {
              parent: true,
              author: {
                select: {
                  name: true,
                  image: true,
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
  id: string;
  path: string;
}

export async function addCommentToThread({
  commentText,
  path,
  threadId,
  id,
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
              id: id,
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
  //           id: id,
  //         },
  //       },
  //     },
  //   });
}

//* ---------------------------------------------------------------fetchUserPosts()------------------------------------------------

interface fetchUserPostsProps {
  id: string;
}

export async function fetchUserPosts({ id }: fetchUserPostsProps) {
  const userThread = prisma.thread.findMany({
    where: {
      parentId: null,
      author: {
        id: id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          username: true,
          name: true,
          image: true,
          id: true,
        },
      },
    },
  });
  return userThread;
}
