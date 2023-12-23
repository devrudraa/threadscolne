"use client";
import { FC, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
// import CharacterCount from "@tiptap/extension-character-count";
import "@/styles/tiptap.css";

interface TipTapProps {
  description: string;
  onChange: (richtext: string) => void;
}
const TipTap: FC<TipTapProps> = ({ description, onChange }) => {
  //* This is the limit of max char user can enter in the textarea
  // const limit = 280;

  const extensions = useMemo(() => [StarterKit, Typography], []);

  const editorProps = useMemo(
    () => ({
      attributes: {
        spellcheck: "true",
      },
    }),
    []
  );

  const editor = useEditor({
    extensions,
    editorProps,
    content: description,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // const calculatePercentage = useCallback(() => {
  //   if (!editor) return 0;
  //   return Math.round(
  //     (100 / limit) * editor.storage.characterCount.characters()
  //   );
  // }, [editor, limit]);

  // const percentage = calculatePercentage();

  return (
    <>
      <Menubar editor={editor} />
      <EditorContent placeholder="What's in your mind..." editor={editor} />
      {/* {editor && (
        <div className={`flex justify-end w-full px-5 -translate-y-8`}>
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            className="character-count__graph"
          >
            <circle r="10" cx="10" cy="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke={
                editor.storage.characterCount.characters() === limit
                  ? "#FB5151"
                  : "#877eff"
              }
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
            />
            <circle r="6" cx="10" cy="10" fill="white" />
          </svg>
        </div>
      )} */}
    </>
  );
};
export default TipTap;
