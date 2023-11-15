import prisma from "../PrismaClient";

export async function DoesUserExist(userId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      userId: userId,
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
    filed: "userId",
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
      userId: userId,
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
