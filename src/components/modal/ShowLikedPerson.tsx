import { FC, useEffect, useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Avatar,
  Spinner,
} from "@nextui-org/react";
import {
  threadLikedBy,
  threadLikedByReturnValue,
} from "@/lib/actions/threads.actions";
import Link from "next/link";

interface ShowLikedPersonProps {
  threadId: string;
  likeCount: number;
}

const ShowLikedPerson: FC<ShowLikedPersonProps> = ({ threadId, likeCount }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [likedData, setLikedData] = useState<threadLikedByReturnValue | null>(
    null
  );

  const fetchData = useCallback(async () => {
    // console.log("fetching data");
    const data = await threadLikedBy({ threadId });
    setLikedData(data);
    likeCount;
  }, [threadId, likeCount]);

  useEffect(() => {
    if (isOpen || likeCount > 0) {
      fetchData();
    }
  }, [isOpen, likeCount, fetchData, onClose]);

  return (
    <>
      <button title="View who liked" onClick={onOpen}>
        {likeCount}
      </button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Liked By {likeCount} people(s)
          </ModalHeader>
          <ModalBody>
            {likedData ? (
              "likedBy" in likedData ? (
                likedData.likedBy.map((like) => (
                  <LikedByUserCard key={like.username} likedBy={like} />
                ))
              ) : (
                <p>Error: {likedData.errorMessage as string}</p>
              )
            ) : (
              <Spinner />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShowLikedPerson;

interface LikedByUserCardProps {
  likedBy: {
    image: string;
    username: string | null;
    name: string;
  };
}
const LikedByUserCard: FC<LikedByUserCardProps> = ({ likedBy }) => {
  return (
    <Link href={"/profile/" + likedBy.username}>
      <div className="flex gap-2 items-center hover:bg-gray-700/50 px-2 py-1 rounded-md">
        <Avatar src={likedBy.image} />
        <div className="">
          <p>{likedBy.name}</p>
          <p className="text-small">@{likedBy.username}</p>
        </div>
      </div>
    </Link>
  );
};
