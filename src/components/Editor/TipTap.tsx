"use client";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
import "@/styles/tiptap.css";
import { maxLengthForThread } from "@/Constants";
import { stripHtmlTags } from "@/lib/utils";

interface TipTapProps {
  description: string;
  onChange: (richtext: string) => void;
}
const TipTap: FC<TipTapProps> = ({ description, onChange }) => {
  //* This is the limit of max char user can enter in the textarea
  // const limit = 280;
  // const [lengthOfTheText, setLengthOfTheText] = useState<number>(0);
  const textLengthIndicatorRef = useRef<HTMLDivElement>(null);

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
    onUpdate({ editor }) {
      const htmlContent = editor.getHTML().trim();
      // Define the regular expression pattern to match any element with no content
      const regex = /<(\w+)(?:\s+[^>]*)?><\/\1>/g;
      // Replace occurrences of <element></element> with an empty string
      const filteredHtml = htmlContent.replace(regex, "").trim();
      // Pass the filtered content to the onChange function

      onChange(filteredHtml);

      if (!textLengthIndicatorRef.current) return;
      const actualTexts = stripHtmlTags(editor.getHTML());

      const percentage = Math.round(
        (100 / maxLengthForThread) * actualTexts.length
      );

      textLengthIndicatorRef.current.style.width = `${percentage}%`;

      if (actualTexts.length > maxLengthForThread)
        textLengthIndicatorRef.current.classList.add("bg-red-500");
      else textLengthIndicatorRef.current.classList.remove("bg-red-500");
    },
  });

  // const calculatePercentage = useCallback(() => {
  //   if (!editor) return 0;
  //   return Math.round((100 / maxLengthForThread) * lengthOfTheText);
  // }, [editor, lengthOfTheText]);

  // console.log(calculatePercentage(), lengthOfTheText);

  // const percentage = calculatePercentage();

  return (
    <section className="border-1 border-white mt-5 rounded-lg overflow-hidden">
      <Menubar editor={editor} />
      <div
        ref={textLengthIndicatorRef}
        className={`h-[3px] bg-primary-500 w-0 transition-all duration-500`}
      />
      <EditorContent className="mt-0" editor={editor} />
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
    </section>
  );
};
export default TipTap;
