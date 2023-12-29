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
    },
    {
      function: editor.chain().toggleItalic(),
      name: "italic",
      icon: <Italic />,
    },
    {
      function: editor.chain().toggleStrike(),
      name: "strike",
      icon: <Strikethrough />,
    },
    {
      function: editor.chain().toggleBulletList(),
      name: "bulletList",
      icon: <List />,
    },
    {
      function: editor.chain().toggleOrderedList(),
      name: "orderedList",
      icon: <ListOrdered />,
    },
    {
      function: editor.chain().toggleCodeBlock(),
      name: "codeBlock",
      icon: <Code />,
    },
    {
      function: editor.chain().toggleBlockquote(),
      name: "blockquote",
      icon: <Quote />,
    },
    // {
    //   function: editor.chain().toggleBlockquote(),
    //   name: "blockquote",
    //   icon: <ImagePlus />,
    // },
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
          <Toggle
            pressed={editor.isActive(item.name)}
            variant={"outline"}
            key={i}
            onClick={() => item.function.focus().run()}
            // disabled={!item.function}
            // className={ ? "is-active" : ""}
          >
            {item.icon}
          </Toggle>
        );
      })}
      <input
        ref={imageInpRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileSelect}
      />
      <Toggle
        pressed={false}
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
      {/* <Input> */}
    </div>
  );
};
export default Menubar;
