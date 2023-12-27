"use client";
import { FC, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
import "@/styles/tiptap.css";
import { maxLengthForThread } from "@/Constants";
import { stripEmptyHtmlTags, stripHtmlTags } from "@/lib/utils";

interface TipTapProps {
  onChange: (richtext: string) => void;
}
const TipTap: FC<TipTapProps> = ({ onChange }) => {
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
      const filteredHtml = stripEmptyHtmlTags(htmlContent);
      onChange(filteredHtml);

      //* The code below is responsible for the count indicator in the text editor
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

  return (
    <section className="border-1 border-white mt-5 rounded-lg overflow-hidden">
      <Menubar editor={editor} />
      <div
        ref={textLengthIndicatorRef}
        className={`h-[3px] bg-primary-500 w-0 transition-all duration-500`}
      />

      <EditorContent className="mt-0 editor" editor={editor} />
    </section>
  );
};
export default TipTap;
