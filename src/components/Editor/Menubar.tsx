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
    </div>
  );

  //   return (
  //     <section className="flex gap-2">
  //       <Toggle
  //         variant="outline"
  //         onClick={() => editor.chain().setParagraph()}
  //         className={editor.isActive("paragraph") ? "is-active" : ""}
  //       >
  //         paragraph
  //       </Toggle>
  //       <Toggle
  //         variant="outline"
  //         onClick={() => editor.chain().toggleBlockquote()}
  //         className={editor.isActive("blockquote") ? "is-active" : ""}
  //       >
  //         <Quote />
  //       </Toggle>
  //     </section>
  //   );
};
export default Menubar;
