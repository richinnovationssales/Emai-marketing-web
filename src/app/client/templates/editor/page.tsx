"use client";

import dynamic from "next/dynamic";

const TemplateEditor = dynamic(
  () => import("@/components/templates/TemplateEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        Loading editor...
      </div>
    ),
  }
);

export default function TemplateEditorPlaygroundPage() {
  return (
    <div className="h-[calc(100vh-4rem)] -m-8">
      {/* No onSave: acts as a sandbox / quick-export tool. */}
      <TemplateEditor />
    </div>
  );
}
