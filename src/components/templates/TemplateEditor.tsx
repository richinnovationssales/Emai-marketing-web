"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {
  Undo,
  Redo,
  Eye,
  EyeOff,
  Code2,
  Download,
  Upload,
  Save,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  FileCode2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TemplateEditorProps {
  templateId?: string;
  initialName?: string;
  initialSubject?: string;
  initialContent?: string;
  onSave?: (data: { name: string; subject: string; content: string }) => void;
  isSaving?: boolean;
}

type DeviceMode = "desktop" | "tablet" | "mobile";
type EditorMode = "mjml" | "html";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEVICES: { id: DeviceMode; label: string; width: string; icon: React.ReactNode }[] = [
  { id: "desktop", label: "Desktop", width: "100%",  icon: <Monitor className="w-4 h-4" /> },
  { id: "tablet",  label: "Tablet",  width: "768px", icon: <Tablet   className="w-4 h-4" /> },
  { id: "mobile",  label: "Mobile",  width: "375px", icon: <Smartphone className="w-4 h-4" /> },
];

const DEFAULT_MJML = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
    <mj-style inline="inline">
      a { color: #4f46e5; }
    </mj-style>
  </mj-head>
  <mj-body background-color="#f0f2f5">

    <!-- Header -->
    <mj-section background-color="#4f46e5" padding="32px 24px">
      <mj-column>
        <mj-text font-size="28px" font-weight="bold" color="#ffffff" align="center">
          Your Email Title
        </mj-text>
        <mj-text font-size="16px" color="#c7d2fe" align="center" padding-top="8px">
          A short subtitle or tagline goes here
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Body -->
    <mj-section background-color="#ffffff" padding="32px 24px">
      <mj-column>
        <mj-text font-size="16px" padding-bottom="16px">
          Hi there,
        </mj-text>
        <mj-text padding-bottom="24px">
          Start editing this template to build your email.
          You can write MJML directly in the editor on the left
          and see a live preview on the right.
        </mj-text>
        <mj-button
          background-color="#4f46e5"
          color="#ffffff"
          border-radius="6px"
          font-size="15px"
          padding="12px 28px"
          href="#"
        >
          Call to Action
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section background-color="#f0f2f5" padding="24px">
      <mj-column>
        <mj-text font-size="12px" color="#9ca3af" align="center">
          © 2025 Your Company ·
          <a href="#">Unsubscribe</a>
        </mj-text>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isMjmlContent(content: string): boolean {
  const t = content.trim().toLowerCase();
  return t.startsWith("<mjml") || t.includes("<mj-body");
}

function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// MJML browser compiler
// Loads mjml-browser from CDN once, caches the promise.
// ---------------------------------------------------------------------------

let _mjmlPromise: Promise<(code: string, opts?: any) => { html: string; errors: any[] }> | null = null;

function getMjmlBrowser() {
  if (_mjmlPromise) return _mjmlPromise;

  _mjmlPromise = new Promise((resolve, reject) => {
    if ((window as any).mjml) {
      resolve((window as any).mjml);
      return;
    }
    const script  = document.createElement("script");
    script.src    = "https://cdn.jsdelivr.net/npm/mjml-browser@4.14.1/lib/index.js";
    script.onload = () => {
      const fn = (window as any).mjml;
      fn ? resolve(fn) : reject(new Error("mjml-browser global not found"));
    };
    script.onerror = () => reject(new Error("Failed to load mjml-browser"));
    document.head.appendChild(script);
  });

  return _mjmlPromise;
}

async function compileMjml(mjmlCode: string): Promise<{ html: string; errors: string[] }> {
  try {
    const mjml   = await getMjmlBrowser();
    const result = mjml(mjmlCode, { validationLevel: "soft" });
    return {
      html:   result.html ?? "",
      errors: (result.errors ?? []).map((e: any) => e.formattedMessage ?? String(e)),
    };
  } catch (err: any) {
    return { html: "", errors: [err?.message ?? "Compilation failed"] };
  }
}

// ---------------------------------------------------------------------------
// Preview Pane
// ---------------------------------------------------------------------------

interface PreviewPaneProps {
  html: string;
  deviceWidth: string;
  isCompiling: boolean;
  errors: string[];
}

function PreviewPane({ html, deviceWidth, isCompiling, errors }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Write HTML into the iframe whenever it changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html || "<html><body></body></html>");
    doc.close();
  }, [html]);

  return (
    <div className="flex-1 flex flex-col bg-[#13131f] overflow-hidden">
      {/* Status bar */}
      <div className="h-9 border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
        {isCompiling ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span className="text-xs text-white/40">Compiling…</span>
          </>
        ) : errors.length > 0 ? (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-400">{errors.length} warning{errors.length > 1 ? "s" : ""}</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-white/40">Ready</span>
          </>
        )}
        <span className="ml-auto text-xs text-white/20 font-mono">{deviceWidth}</span>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-auto flex justify-center items-start py-8 px-6">
        <div
          className="transition-all duration-300 ease-in-out shadow-[0_8px_40px_rgba(0,0,0,0.6)] rounded overflow-hidden bg-white"
          style={{ width: deviceWidth, minHeight: 480 }}
        >
          <iframe
            ref={iframeRef}
            title="Email Preview"
            className="w-full border-0 block"
            style={{ minHeight: 480 }}
            sandbox="allow-same-origin"
            onLoad={(e) => {
              try {
                const h = e.currentTarget.contentDocument?.body?.scrollHeight;
                if (h) e.currentTarget.style.height = `${h + 32}px`;
              } catch { /* cross-origin */ }
            }}
          />
        </div>
      </div>

      {/* Error list */}
      {errors.length > 0 && (
        <div className="border-t border-white/10 max-h-28 overflow-y-auto shrink-0 p-3 space-y-1 bg-amber-950/30">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-amber-300 font-mono leading-4">{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main TemplateEditor
// ---------------------------------------------------------------------------

export default function TemplateEditor({
  templateId,
  initialName    = "",
  initialSubject = "",
  initialContent,
  onSave,
  isSaving = false,
}: TemplateEditorProps) {
  const [templateName,    setTemplateName]    = useState(initialName);
  const [templateSubject, setTemplateSubject] = useState(initialSubject);
  const [device,          setDevice]          = useState<DeviceMode>("desktop");
  const [editorMode,      setEditorMode]      = useState<EditorMode>("mjml");
  const [showPreview,     setShowPreview]     = useState(true);
  const [code,            setCode]            = useState(initialContent ?? DEFAULT_MJML);
  const [previewHtml,     setPreviewHtml]     = useState("");
  const [isCompiling,     setIsCompiling]     = useState(false);
  const [compileErrors,   setCompileErrors]   = useState<string[]>([]);

  const editorRef   = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // Compile logic
  // -------------------------------------------------------------------------
  const compile = useCallback(async (source: string, mode: EditorMode) => {
    if (mode === "html") {
      setPreviewHtml(source);
      setCompileErrors([]);
      setIsCompiling(false);
      return;
    }
    if (!isMjmlContent(source)) {
      setIsCompiling(false);
      return;
    }
    const { html, errors } = await compileMjml(source);
    setPreviewHtml(html);
    setCompileErrors(errors);
    setIsCompiling(false);
  }, []);

  const scheduleCompile = useCallback((source: string, mode: EditorMode) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsCompiling(true);
    debounceRef.current = setTimeout(() => compile(source, mode), 600);
  }, [compile]);

  // Initial compile
  useEffect(() => {
    scheduleCompile(code, editorMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-compile on mode switch
  useEffect(() => {
    scheduleCompile(code, editorMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  // -------------------------------------------------------------------------
  // Monaco mount
  // -------------------------------------------------------------------------
  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // -------------------------------------------------------------------------
  // File import
  // -------------------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isMjml = file.name.toLowerCase().endsWith(".mjml");
    const reader = new FileReader();

    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (!content) return;
      const detectedMode: EditorMode = isMjml || isMjmlContent(content) ? "mjml" : "html";
      setCode(content);
      setEditorMode(detectedMode);
      scheduleCompile(content, detectedMode);
      toast.success(`${detectedMode.toUpperCase()} template imported`);
    };

    reader.onerror = () => toast.error("Failed to read file");
    reader.readAsText(file);
    e.target.value = "";
  };

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const handleSave = async () => {
    if (!templateName.trim()) { toast.error("Please enter a template name"); return; }

    let finalHtml = previewHtml;
    if (editorMode === "mjml" && !finalHtml) {
      const { html, errors } = await compileMjml(code);
      if (!html && errors.length) { toast.error("Fix MJML errors before saving"); return; }
      finalHtml = html;
    }

    onSave?.({ name: templateName, subject: templateSubject, content: finalHtml });
  };

  const handleExportMjml = () => {
    if (editorMode !== "mjml") { toast.error("Switch to MJML mode to export MJML"); return; }
    downloadFile("template.mjml", code, "text/plain");
    toast.success("MJML exported");
  };

  const handleExportHtml = async () => {
    if (editorMode === "html") {
      downloadFile("template.html", code, "text/html");
      toast.success("HTML exported");
      return;
    }
    setIsCompiling(true);
    const { html, errors } = await compileMjml(code);
    setIsCompiling(false);
    if (!html) { toast.error("Could not compile MJML to HTML"); return; }
    if (errors.length) toast.warning("Exported with warnings");
    downloadFile("template.html", html, "text/html");
    toast.success("HTML exported");
  };

  const handleSwitchMode = (newMode: EditorMode) => {
    if (newMode === editorMode) return;
    // When switching to HTML mode, offer to load the compiled HTML
    if (newMode === "html" && previewHtml) setCode(previewHtml);
    setEditorMode(newMode);
  };

  const currentDevice = DEVICES.find((d) => d.id === device)!;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#0f0f1a] text-white">

      {/* ==================================================================
          TOP BAR
      ================================================================== */}
      <header className="h-14 shrink-0 border-b border-white/10 bg-[#0f0f1a] flex items-center px-4 gap-2">

        {/* Brand */}
        <div className="flex items-center gap-2 mr-1">
          <FileCode2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-sm font-semibold text-white/70 hidden md:block tracking-tight">
            Email Editor
          </span>
        </div>
        <div className="w-px h-5 bg-white/10" />

        {/* Template meta inputs (only when onSave provided) */}
        {onSave && (
          <>
            <Input
              placeholder="Template name *"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="h-8 w-40 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
            />
            <Input
              placeholder="Email subject"
              value={templateSubject}
              onChange={(e) => setTemplateSubject(e.target.value)}
              className="h-8 w-48 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
            />
            <div className="w-px h-5 bg-white/10" />
          </>
        )}

        {/* MJML / HTML mode toggle */}
        <div className="flex items-center bg-white/[0.06] rounded-md p-0.5">
          {(["mjml", "html"] as EditorMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleSwitchMode(m)}
              className={cn(
                "px-3 h-7 text-xs font-medium rounded transition-all",
                editorMode === m
                  ? "bg-indigo-600 text-white shadow"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Undo / Redo */}
        <Button
          variant="ghost" size="icon"
          onClick={() => editorRef.current?.trigger("", "undo", null)}
          className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost" size="icon"
          onClick={() => editorRef.current?.trigger("", "redo", null)}
          className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Device switcher */}
        <div className="flex items-center bg-white/[0.06] rounded-md p-0.5">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              title={d.label}
              className={cn(
                "h-7 w-8 flex items-center justify-center rounded transition-all",
                device === d.id
                  ? "bg-indigo-600 text-white shadow"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {d.icon}
            </button>
          ))}
        </div>

        {/* Toggle preview */}
        <Button
          variant="ghost" size="sm"
          onClick={() => setShowPreview((v) => !v)}
          className="h-8 gap-1.5 text-white/50 hover:text-white hover:bg-white/10"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-xs hidden sm:block">{showPreview ? "Hide Preview" : "Preview"}</span>
        </Button>

        <div className="w-px h-5 bg-white/10" />

        {/* Import */}
        <Button
          variant="ghost" size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 gap-1.5 text-white/50 hover:text-white hover:bg-white/10"
        >
          <Upload className="w-4 h-4" />
          <span className="text-xs hidden sm:block">Import</span>
        </Button>

        {/* Export dropdown */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost" size="sm"
              className="h-8 gap-1 text-white/50 hover:text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs hidden sm:block">Export</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1c1c2e] border-white/10 text-white min-w-[150px]">
            <DropdownMenuItem
              onClick={handleExportMjml}
              className="gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              Export MJML
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleExportHtml}
              className="gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export HTML
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Save button (only when onSave provided) */}
        {onSave && (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white border-0 gap-1.5"
          >
            {isSaving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Save className="w-4 h-4" />
            }
            {isSaving ? "Saving…" : "Save"}
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".html,.mjml"
          onChange={handleFileUpload}
        />
      </header>

      {/* ==================================================================
          SPLIT PANE (Editor | Preview)
      ================================================================== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ---- EDITOR PANE ---- */}
        <div className={cn(
          "flex flex-col border-r border-white/10 transition-all duration-300",
          showPreview ? "w-1/2" : "w-full"
        )}>
          {/* Pane header */}
          <div className="h-9 shrink-0 border-b border-white/10 flex items-center px-4 gap-2">
            <Code2 className="w-3.5 h-3.5 text-indigo-400/70" />
            <span className="text-xs font-mono text-white/35">
              {editorMode === "mjml" ? "template.mjml" : "template.html"}
            </span>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language="html"
              value={code}
              theme="vs-dark"
              onMount={handleEditorMount}
              onChange={(value) => {
                const next = value ?? "";
                setCode(next);
                scheduleCompile(next, editorMode);
              }}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 2,
                insertSpaces: true,
                formatOnPaste: true,
                lineNumbers: "on",
                lineNumbersMinChars: 3,
                renderLineHighlight: "line",
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                padding: { top: 12, bottom: 12 },
                bracketPairColorization: { enabled: true },
                quickSuggestions: { other: true, comments: false, strings: true },
                scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
              }}
            />
          </div>
        </div>

        {/* ---- PREVIEW PANE ---- */}
        {showPreview && (
          <PreviewPane
            html={previewHtml}
            deviceWidth={currentDevice.width}
            isCompiling={isCompiling}
            errors={compileErrors}
          />
        )}
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import Editor, { OnMount } from "@monaco-editor/react";
// import * as monaco from "monaco-editor";
// import {
//   Undo,
//   Redo,
//   Eye,
//   EyeOff,
//   Code2,
//   Download,
//   Upload,
//   Save,
//   Smartphone,
//   Tablet,
//   Monitor,
//   RefreshCw,
//   FileCode2,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   ChevronDown,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // ---------------------------------------------------------------------------
// // Types
// // ---------------------------------------------------------------------------

// export interface TemplateEditorProps {
//   templateId?: string;
//   initialName?: string;
//   initialSubject?: string;
//   initialContent?: string;
//   onSave?: (data: { name: string; subject: string; content: string }) => void;
//   isSaving?: boolean;
// }

// type DeviceMode = "desktop" | "tablet" | "mobile";
// type EditorMode = "mjml" | "html";

// // ---------------------------------------------------------------------------
// // Constants
// // ---------------------------------------------------------------------------

// const DEVICES: { id: DeviceMode; label: string; width: string; icon: React.ReactNode }[] = [
//   { id: "desktop", label: "Desktop", width: "100%",  icon: <Monitor className="w-4 h-4" /> },
//   { id: "tablet",  label: "Tablet",  width: "768px", icon: <Tablet   className="w-4 h-4" /> },
//   { id: "mobile",  label: "Mobile",  width: "375px", icon: <Smartphone className="w-4 h-4" /> },
// ];

// const DEFAULT_MJML = `<mjml>
//   <mj-head>
//     <mj-attributes>
//       <mj-all font-family="Arial, sans-serif" />
//       <mj-text font-size="14px" color="#333333" line-height="1.6" />
//     </mj-attributes>
//     <mj-style inline="inline">
//       a { color: #4f46e5; }
//     </mj-style>
//   </mj-head>
//   <mj-body background-color="#f0f2f5">

//     <!-- Header -->
//     <mj-section background-color="#4f46e5" padding="32px 24px">
//       <mj-column>
//         <mj-text font-size="28px" font-weight="bold" color="#ffffff" align="center">
//           Your Email Title
//         </mj-text>
//         <mj-text font-size="16px" color="#c7d2fe" align="center" padding-top="8px">
//           A short subtitle or tagline goes here
//         </mj-text>
//       </mj-column>
//     </mj-section>

//     <!-- Body -->
//     <mj-section background-color="#ffffff" padding="32px 24px">
//       <mj-column>
//         <mj-text font-size="16px" padding-bottom="16px">
//           Hi there,
//         </mj-text>
//         <mj-text padding-bottom="24px">
//           Start editing this template to build your email.
//           You can write MJML directly in the editor on the left
//           and see a live preview on the right.
//         </mj-text>
//         <mj-button
//           background-color="#4f46e5"
//           color="#ffffff"
//           border-radius="6px"
//           font-size="15px"
//           padding="12px 28px"
//           href="#"
//         >
//           Call to Action
//         </mj-button>
//       </mj-column>
//     </mj-section>

//     <!-- Footer -->
//     <mj-section background-color="#f0f2f5" padding="24px">
//       <mj-column>
//         <mj-text font-size="12px" color="#9ca3af" align="center">
//           © 2025 Your Company ·
//           <a href="#">Unsubscribe</a>
//         </mj-text>
//       </mj-column>
//     </mj-section>

//   </mj-body>
// </mjml>`;

// // ---------------------------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------------------------

// function isMjmlContent(content: string): boolean {
//   const t = content.trim().toLowerCase();
//   return t.startsWith("<mjml") || t.includes("<mj-body");
// }

// function downloadFile(filename: string, content: string, mimeType: string): void {
//   const blob = new Blob([content], { type: mimeType });
//   const url  = URL.createObjectURL(blob);
//   const a    = document.createElement("a");
//   a.href     = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// // ---------------------------------------------------------------------------
// // MJML browser compiler
// // Loads mjml-browser from CDN once, caches the promise.
// // ---------------------------------------------------------------------------

// let _mjmlPromise: Promise<(code: string, opts?: any) => { html: string; errors: any[] }> | null = null;

// function getMjmlBrowser() {
//   if (_mjmlPromise) return _mjmlPromise;

//   _mjmlPromise = new Promise((resolve, reject) => {
//     if ((window as any).mjml) {
//       resolve((window as any).mjml);
//       return;
//     }
//     const script  = document.createElement("script");
//     script.src    = "https://cdn.jsdelivr.net/npm/mjml-browser@4.14.1/lib/index.js";
//     script.onload = () => {
//       const fn = (window as any).mjml;
//       fn ? resolve(fn) : reject(new Error("mjml-browser global not found"));
//     };
//     script.onerror = () => reject(new Error("Failed to load mjml-browser"));
//     document.head.appendChild(script);
//   });

//   return _mjmlPromise;
// }

// async function compileMjml(mjmlCode: string): Promise<{ html: string; errors: string[] }> {
//   try {
//     const mjml   = await getMjmlBrowser();
//     const result = mjml(mjmlCode, { validationLevel: "soft" });
//     return {
//       html:   result.html ?? "",
//       errors: (result.errors ?? []).map((e: any) => e.formattedMessage ?? String(e)),
//     };
//   } catch (err: any) {
//     return { html: "", errors: [err?.message ?? "Compilation failed"] };
//   }
// }

// // ---------------------------------------------------------------------------
// // Preview Pane
// // ---------------------------------------------------------------------------

// interface PreviewPaneProps {
//   html: string;
//   deviceWidth: string;
//   isCompiling: boolean;
//   errors: string[];
// }

// function PreviewPane({ html, deviceWidth, isCompiling, errors }: PreviewPaneProps) {
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   // Write HTML into the iframe whenever it changes
//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;
//     const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
//     if (!doc) return;
//     doc.open();
//     doc.write(html || "<html><body></body></html>");
//     doc.close();
//   }, [html]);

//   return (
//     <div className="flex-1 flex flex-col bg-[#13131f] overflow-hidden">
//       {/* Status bar */}
//       <div className="h-9 border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
//         {isCompiling ? (
//           <>
//             <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
//             <span className="text-xs text-white/40">Compiling…</span>
//           </>
//         ) : errors.length > 0 ? (
//           <>
//             <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
//             <span className="text-xs text-amber-400">{errors.length} warning{errors.length > 1 ? "s" : ""}</span>
//           </>
//         ) : (
//           <>
//             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
//             <span className="text-xs text-white/40">Ready</span>
//           </>
//         )}
//         <span className="ml-auto text-xs text-white/20 font-mono">{deviceWidth}</span>
//       </div>

//       {/* Scrollable preview area */}
//       <div className="flex-1 overflow-auto flex justify-center items-start py-8 px-6">
//         <div
//           className="transition-all duration-300 ease-in-out shadow-[0_8px_40px_rgba(0,0,0,0.6)] rounded overflow-hidden bg-white"
//           style={{ width: deviceWidth, minHeight: 480 }}
//         >
//           <iframe
//             ref={iframeRef}
//             title="Email Preview"
//             className="w-full border-0 block"
//             style={{ minHeight: 480 }}
//             sandbox="allow-same-origin"
//             onLoad={(e) => {
//               try {
//                 const h = e.currentTarget.contentDocument?.body?.scrollHeight;
//                 if (h) e.currentTarget.style.height = `${h + 32}px`;
//               } catch { /* cross-origin */ }
//             }}
//           />
//         </div>
//       </div>

//       {/* Error list */}
//       {errors.length > 0 && (
//         <div className="border-t border-white/10 max-h-28 overflow-y-auto shrink-0 p-3 space-y-1 bg-amber-950/30">
//           {errors.map((err, i) => (
//             <p key={i} className="text-xs text-amber-300 font-mono leading-4">{err}</p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------------------------------------------------------------------------
// // Main TemplateEditor
// // ---------------------------------------------------------------------------

// export default function TemplateEditor({
//   templateId,
//   initialName    = "",
//   initialSubject = "",
//   initialContent,
//   onSave,
//   isSaving = false,
// }: TemplateEditorProps) {
//   const [templateName,    setTemplateName]    = useState(initialName);
//   const [templateSubject, setTemplateSubject] = useState(initialSubject);
//   const [device,          setDevice]          = useState<DeviceMode>("desktop");
//   const [editorMode,      setEditorMode]      = useState<EditorMode>("mjml");
//   const [showPreview,     setShowPreview]     = useState(true);
//   const [code,            setCode]            = useState(initialContent ?? DEFAULT_MJML);
//   const [previewHtml,     setPreviewHtml]     = useState("");
//   const [isCompiling,     setIsCompiling]     = useState(false);
//   const [compileErrors,   setCompileErrors]   = useState<string[]>([]);

//   const editorRef   = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // -------------------------------------------------------------------------
//   // Compile logic
//   // -------------------------------------------------------------------------
//   const compile = useCallback(async (source: string, mode: EditorMode) => {
//     if (mode === "html") {
//       setPreviewHtml(source);
//       setCompileErrors([]);
//       setIsCompiling(false);
//       return;
//     }
//     if (!isMjmlContent(source)) {
//       setIsCompiling(false);
//       return;
//     }
//     const { html, errors } = await compileMjml(source);
//     setPreviewHtml(html);
//     setCompileErrors(errors);
//     setIsCompiling(false);
//   }, []);

//   const scheduleCompile = useCallback((source: string, mode: EditorMode) => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     setIsCompiling(true);
//     debounceRef.current = setTimeout(() => compile(source, mode), 600);
//   }, [compile]);

//   // Initial compile
//   useEffect(() => {
//     scheduleCompile(code, editorMode);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Re-compile on mode switch
//   useEffect(() => {
//     scheduleCompile(code, editorMode);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [editorMode]);

//   // -------------------------------------------------------------------------
//   // Monaco mount
//   // -------------------------------------------------------------------------
//   const handleEditorMount: OnMount = (editor) => {
//     editorRef.current = editor;
//   };

//   // -------------------------------------------------------------------------
//   // File import
//   // -------------------------------------------------------------------------
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const isMjml = file.name.toLowerCase().endsWith(".mjml");
//     const reader = new FileReader();

//     reader.onload = (ev) => {
//       const content = ev.target?.result as string;
//       if (!content) return;
//       const detectedMode: EditorMode = isMjml || isMjmlContent(content) ? "mjml" : "html";
//       setCode(content);
//       setEditorMode(detectedMode);
//       scheduleCompile(content, detectedMode);
//       toast.success(`${detectedMode.toUpperCase()} template imported`);
//     };

//     reader.onerror = () => toast.error("Failed to read file");
//     reader.readAsText(file);
//     e.target.value = "";
//   };

//   // -------------------------------------------------------------------------
//   // Actions
//   // -------------------------------------------------------------------------
//   const handleSave = async () => {
//     if (!templateName.trim()) { toast.error("Please enter a template name"); return; }

//     let finalHtml = previewHtml;
//     if (editorMode === "mjml" && !finalHtml) {
//       const { html, errors } = await compileMjml(code);
//       if (!html && errors.length) { toast.error("Fix MJML errors before saving"); return; }
//       finalHtml = html;
//     }

//     onSave?.({ name: templateName, subject: templateSubject, content: finalHtml });
//   };

//   const handleExportMjml = () => {
//     if (editorMode !== "mjml") { toast.error("Switch to MJML mode to export MJML"); return; }
//     downloadFile("template.mjml", code, "text/plain");
//     toast.success("MJML exported");
//   };

//   const handleExportHtml = async () => {
//     if (editorMode === "html") {
//       downloadFile("template.html", code, "text/html");
//       toast.success("HTML exported");
//       return;
//     }
//     setIsCompiling(true);
//     const { html, errors } = await compileMjml(code);
//     setIsCompiling(false);
//     if (!html) { toast.error("Could not compile MJML to HTML"); return; }
//     if (errors.length) toast.warning("Exported with warnings");
//     downloadFile("template.html", html, "text/html");
//     toast.success("HTML exported");
//   };

//   const handleSwitchMode = (newMode: EditorMode) => {
//     if (newMode === editorMode) return;
//     // When switching to HTML mode, offer to load the compiled HTML
//     if (newMode === "html" && previewHtml) setCode(previewHtml);
//     setEditorMode(newMode);
//   };

//   const currentDevice = DEVICES.find((d) => d.id === device)!;

//   // -------------------------------------------------------------------------
//   // Render
//   // -------------------------------------------------------------------------
//   return (
//     <div className="flex flex-col h-screen w-full overflow-hidden bg-[#0f0f1a] text-white">

//       {/* ==================================================================
//           TOP BAR
//       ================================================================== */}
//       <header className="h-14 shrink-0 border-b border-white/10 bg-[#0f0f1a] flex items-center px-4 gap-2">

//         {/* Brand */}
//         <div className="flex items-center gap-2 mr-1">
//           <FileCode2 className="w-5 h-5 text-indigo-400 shrink-0" />
//           <span className="text-sm font-semibold text-white/70 hidden md:block tracking-tight">
//             Email Editor
//           </span>
//         </div>
//         <div className="w-px h-5 bg-white/10" />

//         {/* Template meta inputs (only when onSave provided) */}
//         {onSave && (
//           <>
//             <Input
//               placeholder="Template name *"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//               className="h-8 w-40 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
//             />
//             <Input
//               placeholder="Email subject"
//               value={templateSubject}
//               onChange={(e) => setTemplateSubject(e.target.value)}
//               className="h-8 w-48 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
//             />
//             <div className="w-px h-5 bg-white/10" />
//           </>
//         )}

//         {/* MJML / HTML mode toggle */}
//         <div className="flex items-center bg-white/[0.06] rounded-md p-0.5">
//           {(["mjml", "html"] as EditorMode[]).map((m) => (
//             <button
//               key={m}
//               onClick={() => handleSwitchMode(m)}
//               className={cn(
//                 "px-3 h-7 text-xs font-medium rounded transition-all",
//                 editorMode === m
//                   ? "bg-indigo-600 text-white shadow"
//                   : "text-white/40 hover:text-white/70"
//               )}
//             >
//               {m.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         <div className="w-px h-5 bg-white/10" />

//         {/* Undo / Redo */}
//         <Button
//           variant="ghost" size="icon"
//           onClick={() => editorRef.current?.trigger("", "undo", null)}
//           className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
//           title="Undo (Ctrl+Z)"
//         >
//           <Undo className="w-4 h-4" />
//         </Button>
//         <Button
//           variant="ghost" size="icon"
//           onClick={() => editorRef.current?.trigger("", "redo", null)}
//           className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
//           title="Redo (Ctrl+Y)"
//         >
//           <Redo className="w-4 h-4" />
//         </Button>

//         {/* Spacer */}
//         <div className="flex-1" />

//         {/* Device switcher */}
//         <div className="flex items-center bg-white/[0.06] rounded-md p-0.5">
//           {DEVICES.map((d) => (
//             <button
//               key={d.id}
//               onClick={() => setDevice(d.id)}
//               title={d.label}
//               className={cn(
//                 "h-7 w-8 flex items-center justify-center rounded transition-all",
//                 device === d.id
//                   ? "bg-indigo-600 text-white shadow"
//                   : "text-white/40 hover:text-white/70"
//               )}
//             >
//               {d.icon}
//             </button>
//           ))}
//         </div>

//         {/* Toggle preview */}
//         <Button
//           variant="ghost" size="sm"
//           onClick={() => setShowPreview((v) => !v)}
//           className="h-8 gap-1.5 text-white/50 hover:text-white hover:bg-white/10"
//         >
//           {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//           <span className="text-xs hidden sm:block">{showPreview ? "Hide Preview" : "Preview"}</span>
//         </Button>

//         <div className="w-px h-5 bg-white/10" />

//         {/* Import */}
//         <Button
//           variant="ghost" size="sm"
//           onClick={() => fileInputRef.current?.click()}
//           className="h-8 gap-1.5 text-white/50 hover:text-white hover:bg-white/10"
//         >
//           <Upload className="w-4 h-4" />
//           <span className="text-xs hidden sm:block">Import</span>
//         </Button>

//         {/* Export dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost" size="sm"
//               className="h-8 gap-1 text-white/50 hover:text-white hover:bg-white/10"
//             >
//               <Download className="w-4 h-4" />
//               <span className="text-xs hidden sm:block">Export</span>
//               <ChevronDown className="w-3 h-3" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="bg-[#1c1c2e] border-white/10 text-white min-w-[150px]">
//             <DropdownMenuItem
//               onClick={handleExportMjml}
//               className="gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
//             >
//               <Code2 className="w-4 h-4 text-indigo-400" />
//               Export MJML
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={handleExportHtml}
//               className="gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
//             >
//               <Download className="w-4 h-4 text-emerald-400" />
//               Export HTML
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Save button (only when onSave provided) */}
//         {onSave && (
//           <Button
//             size="sm"
//             onClick={handleSave}
//             disabled={isSaving}
//             className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white border-0 gap-1.5"
//           >
//             {isSaving
//               ? <Loader2 className="w-4 h-4 animate-spin" />
//               : <Save className="w-4 h-4" />
//             }
//             {isSaving ? "Saving…" : "Save"}
//           </Button>
//         )}

//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           accept=".html,.mjml"
//           onChange={handleFileUpload}
//         />
//       </header>

//       {/* ==================================================================
//           SPLIT PANE (Editor | Preview)
//       ================================================================== */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* ---- EDITOR PANE ---- */}
//         <div className={cn(
//           "flex flex-col border-r border-white/10 transition-all duration-300",
//           showPreview ? "w-1/2" : "w-full"
//         )}>
//           {/* Pane header */}
//           <div className="h-9 shrink-0 border-b border-white/10 flex items-center px-4 gap-2">
//             <Code2 className="w-3.5 h-3.5 text-indigo-400/70" />
//             <span className="text-xs font-mono text-white/35">
//               {editorMode === "mjml" ? "template.mjml" : "template.html"}
//             </span>
//           </div>

//           {/* Monaco editor */}
//           <div className="flex-1 overflow-hidden">
//             <Editor
//               height="100%"
//               language="html"
//               value={code}
//               theme="vs-dark"
//               onMount={handleEditorMount}
//               onChange={(value) => {
//                 const next = value ?? "";
//                 setCode(next);
//                 scheduleCompile(next, editorMode);
//               }}
//               options={{
//                 fontSize: 13,
//                 fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace",
//                 fontLigatures: true,
//                 minimap: { enabled: false },
//                 scrollBeyondLastLine: false,
//                 wordWrap: "on",
//                 tabSize: 2,
//                 insertSpaces: true,
//                 formatOnPaste: true,
//                 lineNumbers: "on",
//                 lineNumbersMinChars: 3,
//                 renderLineHighlight: "line",
//                 smoothScrolling: true,
//                 cursorBlinking: "smooth",
//                 cursorSmoothCaretAnimation: "on",
//                 padding: { top: 12, bottom: 12 },
//                 bracketPairColorization: { enabled: true },
//                 quickSuggestions: { other: true, comments: false, strings: true },
//                 scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
//               }}
//             />
//           </div>
//         </div>

//         {/* ---- PREVIEW PANE ---- */}
//         {showPreview && (
//           <PreviewPane
//             html={previewHtml}
//             deviceWidth={currentDevice.width}
//             isCompiling={isCompiling}
//             errors={compileErrors}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import grapesjs, { Editor } from "grapesjs";
// import "grapesjs/dist/css/grapes.min.css";
// import gjsMJML from "grapesjs-mjml";
// import {
//   Undo,
//   Redo,
//   Eye,
//   Code,
//   Download,
//   Upload,
//   Save,
//   Smartphone,
//   Tablet,
//   Monitor,
//   Layers,
//   Palette,
//   Settings,
//   LayoutGrid,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// import { registerBlocks } from "./editor/blocks";
// import {
//   blockManagerConfig,
//   deviceManagerConfig,
//   layerManagerConfig,
//   storageManagerConfig,
//   styleManagerConfig,
//   traitManagerConfig,
// } from "./editor/config";
// import { downloadFile } from "./editor/utils";

// export interface TemplateEditorProps {
//   templateId?: string;
//   initialName?: string;
//   initialSubject?: string;
//   initialContent?: string;
//   onSave?: (data: { name: string; subject: string; content: string }) => void;
//   isSaving?: boolean;
// }

// export default function TemplateEditor({
//   templateId,
//   initialName = "",
//   initialSubject = "",
//   initialContent,
//   onSave,
//   isSaving = false,
// }: TemplateEditorProps) {
//   const [activeLeftTab, setActiveLeftTab] = useState("blocks");
//   const [activeRightTab, setActiveRightTab] = useState("settings");
//   const [templateName, setTemplateName] = useState(initialName);
//   const [templateSubject, setTemplateSubject] = useState(initialSubject);

//   const editorRef = useRef<Editor | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Prevent double initialization
//     if (editorRef.current) {
//       return;
//     }

//     const editor = grapesjs.init({
//       container: containerRef.current,
//       height: "100%",
//       width: "100%",
//       fromElement: false,
//       plugins: [gjsMJML],
//       pluginsOpts: {
//         [gjsMJML as any]: {
//           resetBlocks: false,
//         },
//       },
//       storageManager: storageManagerConfig,
//       blockManager: blockManagerConfig,
//       styleManager: styleManagerConfig,
//       layerManager: layerManagerConfig,
//       traitManager: traitManagerConfig,
//       panels: { defaults: [] },
//       deviceManager: deviceManagerConfig,
//     });

//     editorRef.current = editor;

//     // --- Custom Block Definitions ---
//     registerBlocks(editor);

//     // Clear all default panels to remove unwanted UI elements like the device selector
//     const pnm = editor.Panels;
//     pnm.getPanels().forEach((panel: any) => pnm.removePanel(panel.id));

//     editor.on("load", () => {
//       setIsReady(true);

//       // Load initial content or default template
//       if (initialContent) {
//         editor.setComponents(initialContent);
//       } else if (editor.getHtml() === "") {
//         editor.setComponents(`
//           <mjml>
//             <mj-body background-color="#f0f2f5">
//               <mj-section background-color="#ffffff" padding="20px">
//                 <mj-column>
//                   <mj-text font-size="20px" color="#333333" font-family="Arial, sans-serif">
//                     Welcome to your new email template!
//                   </mj-text>
//                   <mj-text font-size="16px" color="#555555" font-family="Arial, sans-serif">
//                     Drag and drop blocks from the left sidebar to start building.
//                   </mj-text>
//                 </mj-column>
//               </mj-section>
//             </mj-body>
//           </mjml>
//         `);
//       }
//     });

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.destroy();
//         editorRef.current = null;
//       }
//     };
//   }, []);

//   // --- ACTIONS ---

//   const handleDeviceChange = (deviceId: string) => {
//     editorRef.current?.setDevice(deviceId);
//   };

//   const executeCommand = (command: string) => {
//     if (!editorRef.current) return;

//     switch (command) {
//       case "undo":
//         editorRef.current.UndoManager.undo();
//         break;
//       case "redo":
//         editorRef.current.UndoManager.redo();
//         break;
//       case "import":
//         fileInputRef.current?.click();
//         break;
//       case "preview":
//         const isActive = editorRef.current.Commands.isActive("preview");
//         isActive
//           ? editorRef.current.Commands.stop("preview")
//           : editorRef.current.Commands.run("preview");
//         break;
//       case "export-mjml":
//         try {
//           // In grapesjs-mjml, editor.getHtml() returns the MJML content
//           const mjml = editorRef.current.getHtml();
//           console.log("MJML Export:", mjml);
//           if (mjml) {
//             downloadFile("template.mjml", mjml, "text/plain");
//           } else {
//             toast.error("Could not generate MJML");
//           }
//         } catch (err) {
//           console.error("MJML Export Error", err);
//           toast.error("Failed to export MJML");
//         }
//         break;
//       case "export-html":
//         try {
//           // Use mjml-code-to-html command to get the compiled HTML
//           const res = editorRef.current.runCommand("mjml-code-to-html");
//           console.log("HTML Export Result:", res);
//           if (res?.html) {
//             downloadFile("template.html", res.html, "text/html");
//           } else if (typeof res === "string") {
//             // Fallback if it returns string directly
//             downloadFile("template.html", res, "text/html");
//           } else {
//             toast.error("Could not generate HTML");
//           }
//         } catch (err) {
//           console.error("HTML Export Error", err);
//           toast.error("Failed to export HTML");
//         }
//         break;
//       case "clear":
//         editorRef.current.DomComponents.clear();
//         editorRef.current.setComponents(`
//           <mjml>
//             <mj-body background-color="#f0f2f5">
//             </mj-body>
//           </mjml>
//         `);
//         editorRef.current.UndoManager.clear();
//         toast.success("Editor cleared");
//         break;
//       case "save":
//         if (onSave && editorRef.current) {
//           const content = editorRef.current.getHtml();
//           if (!templateName.trim()) {
//             toast.error("Please enter a template name");
//             return;
//           }
//           onSave({
//             name: templateName,
//             subject: templateSubject,
//             content: content || "",
//           });
//         } else {
//           const res = editorRef.current.runCommand("mjml-get-code");
//           if (res) {
//             localStorage.setItem("saved-template", JSON.stringify(res));
//             toast.success("Template saved locally!");
//           }
//         }
//         break;
//     }
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const content = e.target?.result as string;
//       if (editorRef.current && content) {
//         editorRef.current.setComponents(content);
//         toast.success("Template imported successfully");
//       }
//     };
//     reader.onerror = () => {
//       toast.error("Failed to read file");
//     };
//     reader.readAsText(file);
//     // Reset input so same file can be selected again
//     event.target.value = "";
//   };

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-background">
//       {/* LEFT SIDEBAR - BLOCKS & LAYERS */}
//       <div className="w-[300px] border-r bg-background flex flex-col">
//         <div className="h-14 border-b flex items-center px-4 font-semibold gap-2">
//           <LayoutGrid className="w-5 h-5 text-primary" />
//           Components
//         </div>
//         <Tabs
//           value={activeLeftTab}
//           onValueChange={setActiveLeftTab}
//           className="flex-1 flex flex-col"
//         >
//           <TabsList className="grid w-full grid-cols-2 rounded-none h-12">
//             <TabsTrigger
//               value="blocks"
//               className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
//             >
//               <LayoutGrid className="w-4 h-4 mr-2" /> Blocks
//             </TabsTrigger>
//             <TabsTrigger
//               value="layers"
//               className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
//             >
//               <Layers className="w-4 h-4 mr-2" /> Layers
//             </TabsTrigger>
//           </TabsList>

//           <div
//             className="flex-1 p-0 m-0 relative"
//             style={{ display: activeLeftTab === "blocks" ? "block" : "none" }}
//           >
//             <ScrollArea className="h-full">
//               <div
//                 id="blocks-container"
//                 className="p-4 grid grid-cols-2 gap-2 [&_.gjs-block]:w-full [&_.gjs-block]:min-h-[80px] [&_.gjs-block]:border [&_.gjs-block]:border-border [&_.gjs-block]:rounded-md [&_.gjs-block]:flex [&_.gjs-block]:flex-col [&_.gjs-block]:items-center [&_.gjs-block]:justify-center [&_.gjs-block]:bg-card [&_.gjs-block]:hover:border-primary [&_.gjs-block]:cursor-grab [&_.gjs-block]:transition-colors [&_.gjs-block-label]:text-xs [&_.gjs-block-label]:mt-2 [&_.gjs-block-label]:font-medium"
//               ></div>
//             </ScrollArea>
//           </div>

//           <div
//             className="flex-1 p-0 m-0 relative"
//             style={{ display: activeLeftTab === "layers" ? "block" : "none" }}
//           >
//             <ScrollArea className="h-full">
//               <div
//                 id="layers-container"
//                 className="[&_.gjs-layer]:px-4 [&_.gjs-layer]:py-2 [&_.gjs-layer]:border-b [&_.gjs-layer-title]:text-sm"
//               ></div>
//             </ScrollArea>
//           </div>
//         </Tabs>
//       </div>

//       {/* CENTER - CANVAS */}
//       <div className="flex-1 flex flex-col bg-muted/30">
//         {/* Template Metadata */}
//         {onSave && (
//           <div className="border-b bg-background p-4 grid grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <Label htmlFor="template-name">Template Name *</Label>
//               <Input
//                 id="template-name"
//                 placeholder="Enter template name"
//                 value={templateName}
//                 onChange={(e) => setTemplateName(e.target.value)}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="template-subject">Email Subject</Label>
//               <Input
//                 id="template-subject"
//                 placeholder="Enter email subject"
//                 value={templateSubject}
//                 onChange={(e) => setTemplateSubject(e.target.value)}
//               />
//             </div>
//           </div>
//         )}

//         {/* Toolbar */}
//         <div className="h-14 border-b bg-background flex items-center justify-between px-4">
//           <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleDeviceChange("desktop")}
//               title="Desktop"
//             >
//               <Monitor className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleDeviceChange("tablet")}
//               title="Tablet"
//             >
//               <Tablet className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleDeviceChange("mobile")}
//               title="Mobile"
//             >
//               <Smartphone className="w-4 h-4" />
//             </Button>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => executeCommand("undo")}
//             >
//               <Undo className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => executeCommand("redo")}
//             >
//               <Redo className="w-4 h-4" />
//             </Button>
//             <div className="w-px h-6 bg-border mx-2" />
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => executeCommand("clear")}
//               title="Clear all content"
//             >
//               <Trash2 className="w-4 h-4 mr-2" /> Clear
//             </Button>
//             <div className="w-px h-6 bg-border mx-2" />
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => executeCommand("preview")}
//             >
//               <Eye className="w-4 h-4 mr-2" /> Preview
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => executeCommand("import")}
//             >
//               <Upload className="w-4 h-4 mr-2" /> Import
//             </Button>
//             <Button
//               size="sm"
//               onClick={() => executeCommand("save")}
//               disabled={isSaving}
//             >
//               {isSaving ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="w-4 h-4 mr-2" />
//               )}
//               {isSaving ? "Saving..." : "Save"}
//             </Button>
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept=".html,.mjml"
//               onChange={handleFileUpload}
//             />
//           </div>
//         </div>

//         {/* Editor Canvas */}
//         <div className="flex-1 relative overflow-hidden">
//           <div
//             ref={containerRef}
//             className="h-full w-full [&_.gjs-cv-canvas]:bg-muted/30"
//           />
//         </div>
//       </div>

//       {/* RIGHT SIDEBAR - STYLES & TRAITS */}
//       <div className="w-[300px] border-l bg-background flex flex-col">
//         <div className="h-14 border-b flex items-center px-4 font-semibold gap-2">
//           <Settings className="w-5 h-5 text-primary" />
//           Properties
//         </div>
//         <Tabs
//           value={activeRightTab}
//           onValueChange={setActiveRightTab}
//           className="flex-1 flex flex-col"
//         >
//           <TabsList className="grid w-full grid-cols-2 rounded-none h-12">
//             <TabsTrigger
//               value="style"
//               className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
//             >
//               <Palette className="w-4 h-4 mr-2" /> Style
//             </TabsTrigger>
//             <TabsTrigger
//               value="settings"
//               className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
//             >
//               <Settings className="w-4 h-4 mr-2" /> Settings
//             </TabsTrigger>
//           </TabsList>

//           <div
//             className="flex-1 p-0 m-0 relative"
//             style={{ display: activeRightTab === "style" ? "block" : "none" }}
//           >
//             <ScrollArea className="h-full">
//               <div
//                 id="styles-container"
//                 className="p-4 [&_.gjs-sm-sector]:mb-4 [&_.gjs-sm-sector-title]:font-medium [&_.gjs-sm-sector-title]:mb-2 [&_.gjs-sm-field]:bg-background [&_.gjs-sm-input]:bg-background [&_.gjs-sm-input]:border [&_.gjs-sm-input]:border-input [&_.gjs-sm-input]:rounded-md"
//               ></div>
//             </ScrollArea>
//           </div>

//           <div
//             className="flex-1 p-0 m-0 relative"
//             style={{
//               display: activeRightTab === "settings" ? "block" : "none",
//             }}
//           >
//             <ScrollArea className="h-full">
//               {/* Trait Manager */}
//               <div
//                 id="traits-container"
//                 className="p-4 [&_.gjs-trt-trait]:mb-3 [&_.gjs-trt-label]:text-sm [&_.gjs-trt-label]:mb-1 [&_.gjs-trt-input]:w-full [&_.gjs-trt-input]:bg-background [&_.gjs-trt-input]:border [&_.gjs-trt-input]:border-input [&_.gjs-trt-input]:rounded-md [&_.gjs-trt-input]:p-2"
//               ></div>

//               <div className="p-4 border-t mt-4">
//                 <p className="text-xs text-muted-foreground mb-2">
//                   Export Options
//                 </p>
//                 <div className="grid grid-cols-2 gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full"
//                     onClick={() => executeCommand("export-mjml")}
//                   >
//                     <Code className="w-4 h-4 mr-2" /> MJML
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full"
//                     onClick={() => executeCommand("export-html")}
//                   >
//                     <Download className="w-4 h-4 mr-2" /> HTML
//                   </Button>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>
//         </Tabs>
//       </div>

//       {/* Global CSS for GrapesJS customizations that can't be handled by Tailwind classes alone */}
//       <style jsx global>{`
//         /* Remove default GrapesJS borders that conflict with our theme */
//         .gjs-cv-canvas {
//           width: 100%;
//           height: 100%;
//           top: 0;
//         }
//         .gjs-block {
//           user-select: none;
//         }
//         .gjs-one-bg {
//           background-color: transparent;
//         }
//         .gjs-two-color {
//           color: hsl(var(--foreground));
//         }

//         /* Hide all default GrapesJS panels (we use custom UI) */
//         .gjs-pn-panel {
//           display: none !important;
//         }

//         /* Highlight selected component */
//         .gjs-plh-image {
//           background: hsl(var(--primary));
//         }

//         /* Better scrollbars */
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         ::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: hsl(var(--muted));
//           borderradius: 4px;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background: hsl(var(--muted-foreground));
//         }
//       `}</style>
//     </div>
//   );
// }
