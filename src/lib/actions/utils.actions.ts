"use server";
import prisma from "../PrismaClient";
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

export async function GetUserData({ userId }: { userId: string }) {
  return await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      Thread: {
        select: {
          _count: true,
        },
      },
    },
  });
}

export async function isUsernameUnique(username: string): Promise<boolean> {
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
    const validatedData = UsernameValidator.parse(username);

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: validatedData.username,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}
