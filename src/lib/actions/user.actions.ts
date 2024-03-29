"use server";
import { image } from "@nextui-org/react";
import prisma from "../PrismaClient";
import { revalidatePath } from "next/cache";
interface AddUserProps {
  id: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}

export async function AddUser({ userData }: { userData: AddUserProps }) {
  const user = await prisma.user.findMany({
    where: {
      username: userData.username,
    },
  });

  if (user.length != 0) {
    return 409;
  }

  await prisma.user.create({
    data: { ...userData },
  });

  return 200;
}

interface fetchUsersProps {
  searchString: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "desc" | "asc";
}
export async function fetchUsers({
  pageNumber = 1,
  pageSize = 10,
  searchString,
  sortBy = "asc",
}: fetchUsersProps) {
  try {
    const SkipAmount = (pageNumber - 1) * pageSize;
    // const searchRegExp = new RegExp(searchString, "i");

    if (searchString.trim() !== "") {
      const searchResult = await prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: searchString,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: searchString,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          name: sortBy,
        },

        take: pageSize,
        skip: SkipAmount,
      });

      const totalResults = searchResult.length;

      const isNextPage = totalResults > SkipAmount + totalResults;

      return { isNextPage, searchResult };
    }
  } catch (error) {
    console.log(error);

    throw new Error("Error while searching for results!");
  }
}

interface updateUserDataProps {
  id: string;
  name: string;
  username: string;
  bio?: string;
  path: string;
  // image?: string;
}
export async function updateUserData({
  id,
  bio,
  username,
  name,
  path,
}: // path,
updateUserDataProps): Promise<boolean> {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        bio: bio,
        username: username,
        // image: image,
      },
    });
    revalidatePath(path);
    return true;
  } catch (error) {
    console.log(error);

    // throw new Error("Error while searching for results!");
    return false;
  }
}

// * --------------------------------------------------------------fetchUserLikedPostsProps-----------------------------------------

interface fetchUserLikedPostsProps {
  id: string;
  pageNumber?: number;
  pageSize?: number;
}

export async function fetchUserLikedPosts({
  id,
  pageNumber = 1,
  pageSize = 5,
}: fetchUserLikedPostsProps) {
  const SkipAmount = (pageNumber - 1) * pageSize;

  const userLikedThreads = await prisma.user.findMany({
    where: {
      id: id,
    },
    take: pageSize,
    skip: SkipAmount,
    select: {
      likedThreads: {
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
  const isNext = totalResults.length > SkipAmount + userLikedThreads?.length;
  const Threads = userLikedThreads.reduce((e) => e);

  return { ...Threads, isNext };
}
