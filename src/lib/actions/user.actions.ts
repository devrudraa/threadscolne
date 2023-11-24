"use server";
import prisma from "../PrismaClient";
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
              },
            },
            {
              name: {
                contains: searchString,
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
