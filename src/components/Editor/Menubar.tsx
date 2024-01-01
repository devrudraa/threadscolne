"use client";
import type { Editor } from "@tiptap/react";
import { FC, useRef } from "react";
import type { ChangeEvent } from "react";
import {
  Bold,
  Code,
  ImagePlusIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { useDispatch, useSelector } from "react-redux";
import { updateImgSrc } from "@/lib/Store/features/textEditor/editorSlice";
import { RootState } from "@/lib/Store/Store";
import { Tooltip } from "@nextui-org/react";

interface MenubarProps {
  editor: Editor | null;
}
const Menubar: FC<MenubarProps> = ({ editor }) => {
  const imageInpRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const imageSrc = useSelector((state: RootState) => state.src);

  if (!editor) {
    return null;
  }

  const MenuBarTools = [
    {
      function: editor.chain().toggleBold(),
      name: "bold",
      icon: <Bold />,
      arialLabel: "bold",
    },
    {
      function: editor.chain().toggleItalic(),
      name: "italic",
      icon: <Italic />,
      arialLabel: "italic",
    },
    {
      function: editor.chain().toggleStrike(),
      name: "strike",
      icon: <Strikethrough />,
      arialLabel: "strike",
    },
    {
      function: editor.chain().toggleBulletList(),
      name: "bulletList",
      icon: <List />,
      arialLabel: "bulletList",
    },
    {
      function: editor.chain().toggleOrderedList(),
      name: "orderedList",
      icon: <ListOrdered />,
      arialLabel: "orderedList",
    },
    {
      function: editor.chain().toggleCodeBlock(),
      name: "codeBlock",
      icon: <Code />,
      arialLabel: "codeBlock",
    },
    {
      function: editor.chain().toggleBlockquote(),
      name: "blockquote",
      icon: <Quote />,
      arialLabel: "blockquote",
    },
  ];

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) {
        // Todo: Add Toast error notification
        console.error("please select image only");
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        dispatch(updateImgSrc(imageDataUrl));
      };
      fileReader.readAsDataURL(file);
    }
  }

  return (
    <div className="flex gap-2 flex-wrap px-2 py-3 bg-dark-3 ">
      {MenuBarTools.map((item, i) => {
        return (
          <Tooltip content={item.arialLabel} className="rounded-md" key={i}>
            <Toggle
              pressed={editor.isActive(item.name)}
              variant={"outline"}
              aria-label={item.arialLabel}
              onClick={() => item.function.focus().run()}
              // disabled={!item.function}
              // className={ ? "is-active" : ""}
            >
              {item.icon}
            </Toggle>
          </Tooltip>
        );
      })}
      <input
        ref={imageInpRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileSelect}
      />
      <Tooltip content="uploadImage" className="rounded-md">
        <Toggle
          pressed={false}
          aria-label="uploadImage"
          variant={"outline"}
          onClick={() => {
            if (imageInpRef.current) {
              imageInpRef.current.click();
            }
          }}
          disabled={!!imageSrc}
          type="button"
        >
          <ImagePlusIcon />
        </Toggle>
      </Tooltip>
      {/* <Input> */}
    </div>
  );
};
export default Menubar;
