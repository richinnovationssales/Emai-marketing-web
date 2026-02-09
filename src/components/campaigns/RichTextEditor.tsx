"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Code, Heading2, 
  Link as LinkIcon, AlignLeft, AlignCenter, 
  AlignRight, Eraser, User, ImageIcon
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Write your email content here...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[350px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none prose prose-sm max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addTag = (tag: string) => {
    editor.chain().focus().insertContent(`{{${tag}}}`).run();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* TOOLBAR */}
      <div className="bg-muted/30 p-1.5 flex flex-wrap gap-1 border-b items-center">
        
        {/* Text Styles */}
        <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("heading")} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Alignment */}
        <Toggle size="sm" pressed={editor.isActive({ textAlign: "left" })} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: "center" })} onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: "right" })} onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Lists & Blocks */}
        <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("codeBlock")} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Image Upload */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
          className="h-8"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Personalization Tags */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2">
              <User className="h-4 w-4" />
              <span>Tags</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addTag("first_name")}>First Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => addTag("last_name")}>Last Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => addTag("email")}>Email Address</DropdownMenuItem>
            <DropdownMenuItem onClick={() => addTag("company")}>Company</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            title="Clear Formatting"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* EDITOR CONTENT */}
      <EditorContent editor={editor} />
      
      {/* Footer info */}
      <div className="px-3 py-1 border-t text-[10px] text-muted-foreground flex justify-between bg-muted/10">
        <span>Characters: {editor.storage.characterCount?.characters?.() || 0}</span>
        <span>HTML Mode Active</span>
      </div>
    </div>
  );
}

// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Link from "@tiptap/extension-link";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Placeholder from "@tiptap/extension-placeholder";

// import { 
//   Bold, Italic, Underline as UnderlineIcon, 
//   List, ListOrdered, Quote, Code, Heading2, 
//   Link as LinkIcon, AlignLeft, AlignCenter, 
//   AlignRight, Eraser, User
// } from "lucide-react";

// import { Toggle } from "@/components/ui/toggle";
// import { Separator } from "@/components/ui/separator";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// interface RichTextEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link.configure({ openOnClick: false }),
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//       Placeholder.configure({
//         placeholder: "Write your email content here...",
//       }),
//     ],
//     content: value,
//     immediatelyRender: false,
//     editorProps: {
//       attributes: {
//         class: "min-h-[350px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none prose prose-sm max-w-none focus:outline-none",
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   if (!editor) return null;

//   const addTag = (tag: string) => {
//     editor.chain().focus().insertContent(`{{${tag}}}`).run();
//   };

//   return (
//     <div className="border rounded-md overflow-hidden bg-background">
//       {/* TOOLBAR */}
//       <div className="bg-muted/30 p-1.5 flex flex-wrap gap-1 border-b items-center">
        
//         {/* Text Styles */}
//         <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
//           <Bold className="h-4 w-4" />
//         </Toggle>
//         <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
//           <Italic className="h-4 w-4" />
//         </Toggle>
//         <Toggle size="sm" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
//           <UnderlineIcon className="h-4 w-4" />
//         </Toggle>
//         <Toggle size="sm" pressed={editor.isActive("heading")} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
//           <Heading2 className="h-4 w-4" />
//         </Toggle>

//         <Separator orientation="vertical" className="mx-1 h-6" />

//         {/* Alignment */}
//         <Toggle size="sm" pressed={editor.isActive({ textAlign: "left" })} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
//           <AlignLeft className="h-4 w-4" />
//         </Toggle>
//         <Toggle size="sm" pressed={editor.isActive({ textAlign: "center" })} onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
//           <AlignCenter className="h-4 w-4" />
//         </Toggle>
//         <Toggle size="sm" pressed={editor.isActive({ textAlign: "right" })} onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
//           <AlignRight className="h-4 w-4" />
//         </Toggle>

//         <Separator orientation="vertical" className="mx-1 h-6" />

//         {/* Lists & Blocks */}
//         <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
//           <List className="h-4 w-4" />
//         </Toggle>
//         <Toggle size="sm" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
//           <Quote className="h-4 w-4" />
//         </Toggle>
//         <Toggle size="sm" pressed={editor.isActive("codeBlock")} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
//           <Code className="h-4 w-4" />
//         </Toggle>

//         <Separator orientation="vertical" className="mx-1 h-6" />

//         {/* Personalization Tags */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="sm" className="h-8 gap-2">
//               <User className="h-4 w-4" />
//               <span>Tags</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem onClick={() => addTag("first_name")}>First Name</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => addTag("last_name")}>Last Name</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => addTag("email")}>Email Address</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => addTag("company")}>Company</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <div className="ml-auto flex gap-1">
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
//             title="Clear Formatting"
//           >
//             <Eraser className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* EDITOR CONTENT */}
//       <EditorContent editor={editor} />
      
//       {/* Footer info */}
//       <div className="px-3 py-1 border-t text-[10px] text-muted-foreground flex justify-between bg-muted/10">
//         <span>Characters: {editor.storage.characterCount?.characters?.() || 0}</span>
//         <span>HTML Mode Active</span>
//       </div>
//     </div>
//   );
// }