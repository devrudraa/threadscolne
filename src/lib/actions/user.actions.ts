"use server";
import prisma from "../PrismaClient";
interface AddUserProps {
  userId: string;
  username: string;
  name: string;
  bio: string;
  profile_photo: string;
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
