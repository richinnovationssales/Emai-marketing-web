"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsMJML from "grapesjs-mjml";
import {
  Undo,
  Redo,
  Eye,
  Code,
  Download,
  Upload,
  Save,
  Smartphone,
  Tablet,
  Monitor,
  Layers,
  Palette,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { registerBlocks } from "./editor/blocks";
import {
  blockManagerConfig,
  deviceManagerConfig,
  layerManagerConfig,
  storageManagerConfig,
  styleManagerConfig,
  traitManagerConfig,
} from "./editor/config";
import { downloadFile } from "./editor/utils";

export default function TemplateEditor() {
  const [activeLeftTab, setActiveLeftTab] = useState("blocks");
  const [activeRightTab, setActiveRightTab] = useState("settings");

  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double initialization
    if (editorRef.current) {
      return;
    }

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100%",
      width: "100%",
      fromElement: false,
      plugins: [gjsMJML],
      pluginsOpts: {
        [gjsMJML as any]: {
          resetBlocks: false,
        },
      },
      storageManager: storageManagerConfig,
      blockManager: blockManagerConfig,
      styleManager: styleManagerConfig,
      layerManager: layerManagerConfig,
      traitManager: traitManagerConfig,
      panels: { defaults: [] },
      deviceManager: deviceManagerConfig,
    });

    editorRef.current = editor;

    // --- Custom Block Definitions ---
    registerBlocks(editor);

    // Clear all default panels to remove unwanted UI elements like the device selector
    const pnm = editor.Panels;
    pnm.getPanels().forEach((panel: any) => pnm.removePanel(panel.id));

    editor.on("load", () => {
      setIsReady(true);

      // Default template if empty
      if (editor.getHtml() === "") {
        editor.setComponents(`
          <mjml>
            <mj-body background-color="#f0f2f5">
              <mj-section background-color="#ffffff" padding="20px">
                <mj-column>
                  <mj-text font-size="20px" color="#333333" font-family="Arial, sans-serif">
                    Welcome to your new email template!
                  </mj-text>
                  <mj-text font-size="16px" color="#555555" font-family="Arial, sans-serif">
                    Drag and drop blocks from the left sidebar to start building.
                  </mj-text>
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>
        `);
      }
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // --- ACTIONS ---

  const handleDeviceChange = (deviceId: string) => {
    editorRef.current?.setDevice(deviceId);
  };

  const executeCommand = (command: string) => {
    if (!editorRef.current) return;

    switch (command) {
      case "undo":
        editorRef.current.UndoManager.undo();
        break;
      case "redo":
        editorRef.current.UndoManager.redo();
        break;
      case "import":
        fileInputRef.current?.click();
        break;
      case "preview":
        const isActive = editorRef.current.Commands.isActive("preview");
        isActive
          ? editorRef.current.Commands.stop("preview")
          : editorRef.current.Commands.run("preview");
        break;
      case "export-mjml":
        try {
          // In grapesjs-mjml, editor.getHtml() returns the MJML content
          const mjml = editorRef.current.getHtml();
          console.log("MJML Export:", mjml);
          if (mjml) {
            downloadFile("template.mjml", mjml, "text/plain");
          } else {
            toast.error("Could not generate MJML");
          }
        } catch (err) {
          console.error("MJML Export Error", err);
          toast.error("Failed to export MJML");
        }
        break;
      case "export-html":
        try {
          // Use mjml-code-to-html command to get the compiled HTML
          const res = editorRef.current.runCommand("mjml-code-to-html");
          console.log("HTML Export Result:", res);
          if (res?.html) {
            downloadFile("template.html", res.html, "text/html");
          } else if (typeof res === "string") {
            // Fallback if it returns string directly
            downloadFile("template.html", res, "text/html");
          } else {
            toast.error("Could not generate HTML");
          }
        } catch (err) {
          console.error("HTML Export Error", err);
          toast.error("Failed to export HTML");
        }
        break;
      case "save":
        const res = editorRef.current.runCommand("mjml-get-code");
        if (res) {
          localStorage.setItem("saved-template", JSON.stringify(res));
          toast.success("Template saved locally!");
        }
        break;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (editorRef.current && content) {
        editorRef.current.setComponents(content);
        toast.success("Template imported successfully");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* LEFT SIDEBAR - BLOCKS & LAYERS */}
      <div className="w-[300px] border-r bg-background flex flex-col">
        <div className="h-14 border-b flex items-center px-4 font-semibold gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          Components
        </div>
        <Tabs
          value={activeLeftTab}
          onValueChange={setActiveLeftTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none h-12">
            <TabsTrigger
              value="blocks"
              className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Blocks
            </TabsTrigger>
            <TabsTrigger
              value="layers"
              className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Layers className="w-4 h-4 mr-2" /> Layers
            </TabsTrigger>
          </TabsList>

          <div
            className="flex-1 p-0 m-0 relative"
            style={{ display: activeLeftTab === "blocks" ? "block" : "none" }}
          >
            <ScrollArea className="h-full">
              <div
                id="blocks-container"
                className="p-4 grid grid-cols-2 gap-2 [&_.gjs-block]:w-full [&_.gjs-block]:min-h-[80px] [&_.gjs-block]:border [&_.gjs-block]:border-border [&_.gjs-block]:rounded-md [&_.gjs-block]:flex [&_.gjs-block]:flex-col [&_.gjs-block]:items-center [&_.gjs-block]:justify-center [&_.gjs-block]:bg-card [&_.gjs-block]:hover:border-primary [&_.gjs-block]:cursor-grab [&_.gjs-block]:transition-colors [&_.gjs-block-label]:text-xs [&_.gjs-block-label]:mt-2 [&_.gjs-block-label]:font-medium"
              ></div>
            </ScrollArea>
          </div>

          <div
            className="flex-1 p-0 m-0 relative"
            style={{ display: activeLeftTab === "layers" ? "block" : "none" }}
          >
            <ScrollArea className="h-full">
              <div
                id="layers-container"
                className="[&_.gjs-layer]:px-4 [&_.gjs-layer]:py-2 [&_.gjs-layer]:border-b [&_.gjs-layer-title]:text-sm"
              ></div>
            </ScrollArea>
          </div>
        </Tabs>
      </div>

      {/* CENTER - CANVAS */}
      <div className="flex-1 flex flex-col bg-muted/30">
        {/* Toolbar */}
        <div className="h-14 border-b bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeviceChange("desktop")}
              title="Desktop"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeviceChange("tablet")}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeviceChange("mobile")}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => executeCommand("undo")}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => executeCommand("redo")}
            >
              <Redo className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("preview")}
            >
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("import")}
            >
              <Upload className="w-4 h-4 mr-2" /> Import
            </Button>
            <Button size="sm" onClick={() => executeCommand("save")}>
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".html,.mjml"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={containerRef}
            className="h-full w-full [&_.gjs-cv-canvas]:bg-muted/30"
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR - STYLES & TRAITS */}
      <div className="w-[300px] border-l bg-background flex flex-col">
        <div className="h-14 border-b flex items-center px-4 font-semibold gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Properties
        </div>
        <Tabs
          value={activeRightTab}
          onValueChange={setActiveRightTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none h-12">
            <TabsTrigger
              value="style"
              className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Palette className="w-4 h-4 mr-2" /> Style
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <div
            className="flex-1 p-0 m-0 relative"
            style={{ display: activeRightTab === "style" ? "block" : "none" }}
          >
            <ScrollArea className="h-full">
              <div
                id="styles-container"
                className="p-4 [&_.gjs-sm-sector]:mb-4 [&_.gjs-sm-sector-title]:font-medium [&_.gjs-sm-sector-title]:mb-2 [&_.gjs-sm-field]:bg-background [&_.gjs-sm-input]:bg-background [&_.gjs-sm-input]:border [&_.gjs-sm-input]:border-input [&_.gjs-sm-input]:rounded-md"
              ></div>
            </ScrollArea>
          </div>

          <div
            className="flex-1 p-0 m-0 relative"
            style={{
              display: activeRightTab === "settings" ? "block" : "none",
            }}
          >
            <ScrollArea className="h-full">
              {/* Trait Manager */}
              <div
                id="traits-container"
                className="p-4 [&_.gjs-trt-trait]:mb-3 [&_.gjs-trt-label]:text-sm [&_.gjs-trt-label]:mb-1 [&_.gjs-trt-input]:w-full [&_.gjs-trt-input]:bg-background [&_.gjs-trt-input]:border [&_.gjs-trt-input]:border-input [&_.gjs-trt-input]:rounded-md [&_.gjs-trt-input]:p-2"
              ></div>

              <div className="p-4 border-t mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Export Options
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => executeCommand("export-mjml")}
                  >
                    <Code className="w-4 h-4 mr-2" /> MJML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => executeCommand("export-html")}
                  >
                    <Download className="w-4 h-4 mr-2" /> HTML
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </div>

      {/* Global CSS for GrapesJS customizations that can't be handled by Tailwind classes alone */}
      <style jsx global>{`
        /* Remove default GrapesJS borders that conflict with our theme */
        .gjs-cv-canvas {
          width: 100%;
          height: 100%;
          top: 0;
        }
        .gjs-block {
          user-select: none;
        }
        .gjs-one-bg {
          background-color: transparent;
        }
        .gjs-two-color {
          color: hsl(var(--foreground));
        }

        /* Hide all default GrapesJS panels (we use custom UI) */
        .gjs-pn-panel {
          display: none !important;
        }

        /* Highlight selected component */
        .gjs-plh-image {
          background: hsl(var(--primary));
        }

        /* Better scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          borderradius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
