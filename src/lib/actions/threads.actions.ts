"use server";
import { revalidatePath } from "next/cache";
import prisma from "../PrismaClient";
import { tree } from "next/dist/build/templates/app-page";
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
      likedBy: {
        select: {
          name: true,
          id: true,
          username: true,
          image: true,
        },
      },
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
  try {
    const threadPost = await prisma.thread.findFirst({
      where: {
        id: threadId,
      },
      include: {
        likedBy: {
          select: {
            name: true,
            id: true,
            username: true,
            image: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        children: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            likedBy: {
              select: {
                name: true,
                id: true,
                username: true,
                image: true,
              },
            },
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

    return threadPost;
  } catch (error) {
    return false;
  }
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
  pageNumber?: number;
  pageSize?: number;
}

export async function fetchUserPosts({
  id,
  pageNumber = 1,
  pageSize = 5,
}: fetchUserPostsProps) {
  const SkipAmount = (pageNumber - 1) * pageSize;

  const userThread = await prisma.thread.findMany({
    where: {
      parentId: null,
      author: {
        id: id,
      },
    },
    take: pageSize,
    skip: SkipAmount,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      likedBy: {
        select: {
          name: true,
          id: true,
          username: true,
          image: true,
        },
      },
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

  const totalResults = await prisma.thread.findMany({
    where: {
      parentId: null,
      author: {
        id: id,
      },
    },
    include: {
      _count: true,
    },
  });
  const isNext = totalResults.length > SkipAmount + userThread?.length;

  return { userThread, isNext };
}

//* ---------------------------------------------------------------likeUnLike()------------------------------------------------
interface likeUnLikeProps {
  threadId: string;
  userId: string;
}

export async function likeUnLike({
  threadId,
  userId,
}: likeUnLikeProps): Promise<
  { error: boolean; errorMessage: unknown } | null | undefined
> {
  try {
    // Fetch the thread with likedBy relation
    const existingThread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: { likedBy: true },
    });

    if (!existingThread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }

    // Check if the user has already liked the thread
    const userLikedThread = existingThread.likedBy.some(
      (user) => user.id === userId
    );

    if (userLikedThread) {
      // User has already liked the thread, so remove the like
      await prisma.thread.update({
        where: { id: threadId },
        data: {
          likedBy: {
            disconnect: { id: userId },
          },
        },
        include: { likedBy: true }, // Include likedBy relation in the response
      });
      // return true;
    } else {
      // User has not liked the thread, so add the like
      await prisma.thread.update({
        where: { id: threadId },
        data: {
          likedBy: {
            connect: { id: userId },
          },
        },
        include: { likedBy: true }, // Include likedBy relation in the response
      });
      // return true;
    }
  } catch (error) {
    console.error("Error adding like:", error);
    return {
      error: true,
      errorMessage: error,
    };
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client
  }
}

//* ------------------------------------------------------- Thread Liked By -----------------------------------------

interface ThreadLikedByProps {
  threadId: string;
}
interface Error {
  error: boolean;
  errorMessage: unknown;
}
interface Data {
  likedBy: {
    image: string;
    username: string | null;
    name: string;
  }[];
}

export type threadLikedByReturnValue = Error | Data;
export async function threadLikedBy({
  threadId,
}: ThreadLikedByProps): Promise<threadLikedByReturnValue> {
  try {
    // Fetch the thread with likedBy relation
    const existingThread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: {
        likedBy: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (!existingThread) {
      return {
        error: true,
        errorMessage: "Thread not found!",
      };
    }

    return existingThread;
  } catch (error) {
    console.error("Error adding like:", error);
    return {
      error: true,
      errorMessage: error,
    };
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client
  }
}
