"use server";
import { UTApi } from "uploadthing/server";
import prisma from "../PrismaClient";

const utapi = new UTApi();

export async function deleteFile(file: string | string[]): Promise<void> {
  console.log(file);
  await utapi.deleteFiles(file);
}

interface uploadUserProfilePic {
  id: string;
  image: string;
}
export async function uploadUserProfilePic({
  id,
  image,
}: uploadUserProfilePic): Promise<boolean> {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        image: image,
      },
    });
    return true;
  } catch (error) {
    console.log(error);

    // throw new Error("Error while searching for results!");
    return false;
  }
}
