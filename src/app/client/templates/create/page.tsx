'use client';

import dynamic from 'next/dynamic';

const TemplateEditor = dynamic(() => import('@/components/templates/TemplateEditor'), { 
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center">Loading editor...</div>
});

export default function CreateTemplatePage() {
  return (
    <div className="h-[calc(100vh-4rem)] -m-8"> 
      {/* 
        -m-8 to counteract default padding if any from layout (adjust as needed)
        h-[calc(100vh-4rem)] to account for header usually 
        This is a temporary adjustment to fit the full screen editor 
      */}
      <TemplateEditor />
    </div>
  );
}
