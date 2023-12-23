import type { Editor } from "@tiptap/react";
import { FC } from "react";
import {
  Bold,
  Code,
  ImagePlus,
  Italic,
  Key,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "../ui/toggle";

interface MenubarProps {
  editor: Editor | null;
}
const Menubar: FC<MenubarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const MenuBarTools = [
    {
      function: editor.chain().focus().toggleBold(),
      name: "bold",
      icon: <Bold />,
    },
    {
      function: editor.chain().focus().toggleItalic(),
      name: "italic",
      icon: <Italic />,
    },
    {
      function: editor.chain().focus().toggleStrike(),
      name: "strike",
      icon: <Strikethrough />,
    },
    {
      function: editor.chain().focus().toggleBulletList(),
      name: "bulletList",
      icon: <List />,
    },
    {
      function: editor.chain().focus().toggleOrderedList(),
      name: "orderedList",
      icon: <ListOrdered />,
    },
    {
      function: editor.chain().focus().toggleCodeBlock(),
      name: "codeBlock",
      icon: <Code />,
    },
    {
      function: editor.chain().focus().toggleBlockquote(),
      name: "blockquote",
      icon: <Quote />,
    },
    // {
    //   function: editor.chain().focus().toggleBlockquote(),
    //   name: "blockquote",
    //   icon: <ImagePlus />,
    // },
  ];

  return (
    <div className="flex gap-2 px-2 py-3 bg-dark-3 rounded-lg mb-1 mt-5 flex-wrap">
      {MenuBarTools.map((item, i) => {
        return (
          <Toggle
            pressed={editor.isActive(item.name)}
            variant={"outline"}
            key={i}
            onClick={() => item.function.run()}
            // disabled={!item.function}
            // className={ ? "is-active" : ""}
          >
            {item.icon}
          </Toggle>
        );
      })}
    </div>
  );

  //   return (
  //     <section className="flex gap-2">
  //       <Toggle
  //         variant="outline"
  //         onClick={() => editor.chain().focus().setParagraph()}
  //         className={editor.isActive("paragraph") ? "is-active" : ""}
  //       >
  //         paragraph
  //       </Toggle>
  //       <Toggle
  //         variant="outline"
  //         onClick={() => editor.chain().focus().toggleBlockquote()}
  //         className={editor.isActive("blockquote") ? "is-active" : ""}
  //       >
  //         <Quote />
  //       </Toggle>
  //     </section>
  //   );
};
export default Menubar;
