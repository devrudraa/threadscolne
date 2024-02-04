"use client";
import { FC } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { DeleteThread } from "@/lib/actions/threads.actions";

interface ThreadCardOptionsProps {
  threadId: string;
  authorId: string;
}
const ThreadCardOptions: FC<ThreadCardOptionsProps> = ({
  authorId,
  threadId,
}) => {
  const router = useRouter();

  async function deleteThread() {
    const response = await DeleteThread({ authorId, threadId });
    if (response) router.refresh();
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" size="sm" isIconOnly>
          <MoreVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          onClick={deleteThread}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default ThreadCardOptions;
