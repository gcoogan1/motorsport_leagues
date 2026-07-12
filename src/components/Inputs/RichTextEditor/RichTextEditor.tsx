import { useEffect, useRef, useState } from "react";
import { useEditor, type Editor } from "@tiptap/react";
// import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
import { FormProvider, useForm } from "react-hook-form";

import HardBreak from "@tiptap/extension-hard-break";
import BoldIcon from "@assets/Icon/Bold.svg?react";
import ItalicIcon from "@assets/Icon/Italic.svg?react";
import UnderlineIcon from "@assets/Icon/Underlined.svg?react";
import NumberListIcon from "@assets/Icon/Numbered.svg?react";
import BulletListIcon from "@assets/Icon/Bulleted.svg?react";
import CenterAlignIcon from "@assets/Icon/Centered.svg?react";
// import LinkIcon from "@assets/Icon/Link.svg?react";
import ImageIcon from "@assets/Icon/Image.svg?react";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
// import VideoIcon from "@assets/Icon/Video.svg?react";

import {
  Wrapper,
  TopRow,
  CharacterCounter,
  Contents,
  Controls,
  ToolbarButton,
  StyledEditorContent,
  HelperText,
  Label,
  SelectWrapper,
  ErrorText,
} from "./RichTextEditor.styles";
import SelectInput from "../SelectInput/SelectInput";
import Button from "@/components/Button/Button";
import { type RichTextEditorImageUploadResult, MAX_CHARACTERS, type RichTextEditorFormValues, readFileAsDataUrl, getHeadingLevel, HEADING_OPTIONS } from "./RichTextEditor.util";


type RichTextEditorProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  maxCharacters?: number;
  showCount?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onImageUpload?: (file: File) => Promise<RichTextEditorImageUploadResult>;
};

const getActiveHeadingValue = (editor: Editor) => {
  for (let level = 1; level <= 6; level += 1) {
    if (editor.isActive("heading", { level })) {
      return `h${level}`;
    }
  }

  return "paragraph";
};


const RichTextEditor = ({
  value,
  defaultValue = "",
  onChange,
  onImageUpload,
  label,
  helperText,
  placeholder,
  maxCharacters = MAX_CHARACTERS,
  showCount = true,
  hasError,
  errorMessage,
}: RichTextEditorProps) => {
  const [internalContent, setInternalContent] = useState(defaultValue);
  const [characterCount, setCharacterCount] = useState(0);
  const [, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const content = value ?? internalContent;
  const formMethods = useForm<RichTextEditorFormValues>({
    defaultValues: {
      heading: "paragraph",
    },
  });

// const EnterAsLineBreak = Extension.create({
//   addKeyboardShortcuts() {
//     return {
//       Enter: () => this.editor.commands.setHardBreak(),
//     };
//   },
// });

  // Initialize the editor with the useEditor hook
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        hardBreak: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder,
      }),

      CharacterCount.configure({
        limit: maxCharacters,
      }),
      Image.configure({
        HTMLAttributes: {
          loading: "lazy",
          decoding: "async",
        },
      }),
      HardBreak,
      // EnterAsLineBreak,
      // Link.configure({
      //   openOnClick: false,
      //   autolink: true,
      // }),
    ],

    content,

    onUpdate: ({ editor }) => {
      const nextContent = editor.getHTML();

      if (value === undefined) {
        setInternalContent(nextContent);
      }

      setCharacterCount(editor.storage.characterCount.characters());
      onChange?.(nextContent);
    },
  });

  // Sync the editor content with the value prop when it changes
  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() === content) {
      return;
    }

    editor.commands.setContent(content, { emitUpdate: false });
    setCharacterCount(editor.storage.characterCount.characters());
  }, [content, editor]);

  // Initialize character count once editor is ready
  useEffect(() => {
    if (!editor) return;
    setCharacterCount(editor.storage.characterCount.characters());
  }, [editor]);

  // Sync the active heading with the form value
  useEffect(() => {
    if (!editor) {
      return;
    }

    const syncHeading = () => {
      const nextHeading = getActiveHeadingValue(editor);

      if (formMethods.getValues("heading") !== nextHeading) {
        formMethods.setValue("heading", nextHeading);
      }
    };

    syncHeading();
    editor.on("selectionUpdate", syncHeading);
    // editor.on("transaction", syncHeading);

    return () => {
      editor.off("selectionUpdate", syncHeading);
      // editor.off("transaction", syncHeading);
    };
  }, [editor, formMethods]);

  // Calculate the character count
  // (removed stale useMemo — now tracked in state via onUpdate)

  // -- Handlers --- //
  
  // Insert an image into the editor
  const insertImage = async (file: File) => {
    const uploadResult = onImageUpload
      ? await onImageUpload(file)
      : await readFileAsDataUrl(file);

    const image =
      typeof uploadResult === "string"
        ? { src: uploadResult, alt: file.name }
        : {
            src: uploadResult.src,
            alt: uploadResult.alt ?? file.name,
          };

    editor.chain().focus().setImage(image).run();
  };


  // Handle image selection from the file input
  const handleImageSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {

    const files = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (files.length === 0 || !editor) {
      return;
    }

    setIsUploadingImage(true);

    try {
      for (const file of files) {
        await insertImage(file);
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleHeadingChange = (nextHeading: string) => {
    if (!editor) {
      return;
    }

    const activeHeading = getActiveHeadingValue(editor);

    if (activeHeading === nextHeading) {
      return;
    }

    if (nextHeading === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = getHeadingLevel(nextHeading);

      if (!level) {
        return;
      }

      editor.chain().focus().setHeading({ level }).run();
    }

    window.requestAnimationFrame(() => {
      editor.commands.focus();
    });
  };

  const handleToolbarMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
  };

//   const handleLink = () => {
//   if (!editor) return;

//   const previousUrl = editor.getAttributes("link").href;

//   const url = window.prompt("Enter URL", previousUrl);

//   if (url === null) {
//     return;
//   }

//   if (url === "") {
//     editor.chain().focus().unsetLink().run();
//     return;
//   }

//   editor
//     .chain()
//     .focus()
//     .extendMarkRange("link")
//     .setLink({ href: url })
//     .run();
// };

  if (!editor) {
    return null;
  }

  return (
    <FormProvider {...formMethods}>
      <Wrapper>
        <TopRow>
          <Label>{label}</Label>

          {showCount && (
            <CharacterCounter>
              {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()}
            </CharacterCounter>
          )}
        </TopRow>

        <Contents $hasError={!!hasError}>
          <Controls>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelection}
            />
            <SelectWrapper>
              <SelectInput
                name="heading"
                options={[...HEADING_OPTIONS]}
                blurInputOnSelect
                onValueChange={handleHeadingChange}
              />
            </SelectWrapper>

            <ToolbarButton
              $isActive={editor.isActive("bold")}
              onMouseDown={handleToolbarMouseDown}
            >
              <Button
                size="small"
                color="base"
                variant={editor.isActive("bold") ? "filled" : "ghost"}
                icon={{ left: <BoldIcon /> }}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
            </ToolbarButton>
            <ToolbarButton
              $isActive={editor.isActive("italic")}
              onMouseDown={handleToolbarMouseDown}
            >
              <Button
                size="small"
                color="base"
                variant={editor.isActive("italic") ? "filled" : "ghost"}
                icon={{ left: <ItalicIcon /> }}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
            </ToolbarButton>
            <ToolbarButton
              $isActive={editor.isActive("underline")}
              onMouseDown={handleToolbarMouseDown}
            >
              <Button
                size="small"
                color="base"
                variant={editor.isActive("underline") ? "filled" : "ghost"}
                icon={{ left: <UnderlineIcon /> }}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
            </ToolbarButton>
            <ToolbarButton
              $isActive={editor.isActive("orderedList")}
              onMouseDown={handleToolbarMouseDown}
            >
              <Button
                size="small"
                color="base"
                variant={editor.isActive("orderedList") ? "filled" : "ghost"}
                icon={{ left: <NumberListIcon /> }}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
            </ToolbarButton>
            <ToolbarButton
              $isActive={editor.isActive("bulletList")}
              onMouseDown={handleToolbarMouseDown}
            >
              <Button
                size="small"
                color="base"
                variant={editor.isActive("bulletList") ? "filled" : "ghost"}
                icon={{ left: <BulletListIcon /> }}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
            </ToolbarButton>
            <ToolbarButton
              $isActive={editor.isActive({ textAlign: "center" })}
              onMouseDown={handleToolbarMouseDown}
            >
              <Button
                size="small"
                color="base"
                variant={editor.isActive({ textAlign: "center" }) ? "filled" : "ghost"}
                icon={{ left: <CenterAlignIcon /> }}
                onClick={() =>
                  editor.chain().focus().toggleTextAlign("center").run()
                }
              />
            </ToolbarButton>
            <ToolbarButton $isActive={editor.isActive("link")}>
              {/* <Button
                size="small"
                color="base"
                variant={editor.isActive("link") ? "filled" : "ghost"}
                icon={{ left: <LinkIcon /> }}
                ariaLabel="Insert link"
                onClick={handleLink}

              /> */}
            </ToolbarButton>
            <ToolbarButton $isActive={editor.isActive("image")}>
              <Button
                size="small"
                color="base"
                variant={editor.isActive("image") ? "filled" : "ghost"}
                icon={{ left: <ImageIcon /> }}
                ariaLabel="Insert image"
                // isLoading={isUploadingImage}
                onClick={handleImageButtonClick}
              />
            </ToolbarButton>
          </Controls>

          <StyledEditorContent editor={editor} />
        </Contents>

        {!!helperText && <HelperText>{helperText}</HelperText>}
        {!!hasError && (
        <ErrorText>
          <Error_Outlined width={18} height={18} /> {errorMessage}
        </ErrorText>
      )}
      </Wrapper>
    </FormProvider>
  );
};

export default RichTextEditor;
