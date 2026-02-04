"use client";

import { useState, useRef } from "react";
import {
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Wand2,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Editor, { type Monaco } from "@monaco-editor/react";

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0; }
    .content { background: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto; }
    .button { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <div class="content">
    <h1>Hello {{firstName}}!</h1>
    <p>This is a fully responsive editor layout.</p>
    <a href="{{callToActionUrl}}" class="button">Get Started</a>
  </div>
</body>
</html>`;

export default function TemplateEditorPage() {
  const [templateName, setTemplateName] = useState("welcome-invoice.html");
  const [htmlCode, setHtmlCode] = useState(DEFAULT_TEMPLATE);
  const [showPreview, setShowPreview] = useState(true);
  const editorRef = useRef<any>(null);
  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setHtmlCode(event.target.result);
        setTemplateName(file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = templateName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    editorRef.current?.getAction("editor.action.formatDocument").run();
  };

  const getPreviewHtml = () => {
    return htmlCode.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const mock: Record<string, string> = {
        firstName: "Emma",
        callToActionUrl: "#",
      };
      return mock[key] || `{{${key}}}`;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-gray-100 overflow-hidden">
      {/* --- RESPONSIVE TOOLBAR --- */}
      <div className="bg-[#2d2d2d] border-b border-gray-700 px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Button
            variant="default"
            size="sm"
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] h-8 shrink-0"
            asChild
          >
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Choose File</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".html"
              />
            </label>
          </Button>
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full max-w-[180px] h-8 bg-[#3a3a3a] border-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Toggle Button: Always visible */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className={`h-8 border-gray-600 ${showPreview ? "bg-blue-600/20 text-blue-400" : "bg-[#3a3a3a] text-white"}`}
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4 sm:mr-2" />
            ) : (
              <Eye className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden md:inline">
              {showPreview ? "Hide Preview" : "Show Preview"}
            </span>
          </Button>

          <div className="h-6 w-[1px] bg-gray-600 mx-1 hidden sm:block" />

          {/* Action Icons: Become icon-only on very small screens */}
          <Button
            size="sm"
            onClick={() => setHtmlCode(DEFAULT_TEMPLATE)}
            className="bg-[#4a4a4a] h-8"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Reset</span>
          </Button>

          <Button
            size="sm"
            onClick={handleFormat}
            className="bg-blue-600 hover:bg-blue-700 h-8"
            title="Format"
          >
            <Wand2 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Format</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 h-8"
            title="Download"
          >
            <Download className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Editor Container */}
        <div
          className={`
          ${showPreview ? "h-1/2 lg:h-full lg:w-1/2" : "h-full lg:w-full"} 
          border-r border-b lg:border-b-0 border-gray-700 transition-all duration-300
        `}
        >
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={htmlCode}
            onChange={(value) => setHtmlCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              formatOnPaste: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 10 },
            }}
          />
        </div>

        {/* Preview Container */}
        {showPreview && (
          <div className="flex-1 lg:w-1/2 bg-[#2a2a2a] p-2 sm:p-4 md:p-8 overflow-auto flex justify-center items-start animate-in fade-in lg:slide-in-from-right duration-300">
            <div className="bg-white shadow-2xl w-full max-w-full lg:max-w-[650px] min-h-full rounded-sm overflow-hidden">
              <iframe
                srcDoc={getPreviewHtml()}
                className="w-full h-[500px] lg:min-h-[800px] border-0"
                title="Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
