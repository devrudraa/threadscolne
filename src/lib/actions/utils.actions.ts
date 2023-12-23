"use server";
import prisma from "../PrismaClient";
import getAuthSession from "../authOptions";
import { UsernameValidator } from "../validators/Username";

export async function DoesUserExist(userId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user) {
    return true;
  }
  return false;
}

export async function IsUserOnBoarded({
  userId,
}: {
  userId: string;
}): Promise<boolean> {
  const userExist = await DoesUserExist(userId);

  if (!userExist) return false;

  const filedData = await GetUserDataFiled({
    filed: "id",
    value: userId,
  });

  return filedData?.bio != "";
}

export async function GetUserDataFiled({
  value,
  filed,
}: {
  value: any;
  filed: any;
}) {
  const userDataFiled = await prisma.user.findFirst({
    where: {
      [filed]: value,
    },
  });

  return userDataFiled;
}

export async function GetUserData({ username }: { username: string }) {
  return await prisma.user.findFirst({
    where: {
      username: username,
    },
    include: {
      Thread: {
        where: {
          parentId: null,
        },
        select: {
          _count: true,
        },
      },
    },
  });
}

export async function isUsernameUnique(username: string): Promise<boolean> {
  const currentSession = await getAuthSession();

  if (username === currentSession?.user.username) return true;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  return !user;
}

interface setUserUsernameProps {
  username: string;
  id: string | undefined;
}

export async function setUserUsername({
  username,
  id,
}: setUserUsernameProps): Promise<boolean> {
  if (!id) return false;

  try {
    await UsernameValidator.parseAsync({ username: username.trim() });

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
      },
    });
    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
}
