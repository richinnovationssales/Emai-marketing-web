"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsMJML from "grapesjs-mjml";
import {
  Undo,
  Redo,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CampaignEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
}

export function CampaignEditor({
  value,
  onChange,
  className,
}: CampaignEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState("desktop");
  const lastValueRef = useRef<string>(value);

  // Initialize GrapeJS editor
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

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
      storageManager: false,
      panels: { defaults: [] },
      deviceManager: {
        devices: [
          { id: "desktop", name: "Desktop", width: "" },
          { id: "tablet", name: "Tablet", width: "768px" },
          { id: "mobile", name: "Mobile", width: "375px" },
        ],
      },
      blockManager: {
        appendTo: "#campaign-blocks-container",
      },
    });

    editorRef.current = editor;

    // Clear all default panels
    const pnm = editor.Panels;
    pnm.getPanels().forEach((panel: any) => pnm.removePanel(panel.id));

    // Register some basic MJML blocks for campaign editing
    const bm = editor.BlockManager;

    bm.add("mj-section", {
      label: "Section",
      category: "Layout",
      content: `<mj-section background-color="#ffffff" padding="20px"><mj-column></mj-column></mj-section>`,
    });

    bm.add("mj-column", {
      label: "Column",
      category: "Layout",
      content: `<mj-column></mj-column>`,
    });

    bm.add("mj-text", {
      label: "Text",
      category: "Content",
      content: `<mj-text font-size="16px" color="#555555" font-family="Arial, sans-serif">Enter your text here</mj-text>`,
    });

    bm.add("mj-button", {
      label: "Button",
      category: "Content",
      content: `<mj-button background-color="#3b82f6" color="#ffffff" font-size="14px" border-radius="4px" href="#">Click Me</mj-button>`,
    });

    bm.add("mj-image", {
      label: "Image",
      category: "Content",
      content: `<mj-image src="https://via.placeholder.com/600x200" alt="Image" />`,
    });

    bm.add("mj-divider", {
      label: "Divider",
      category: "Content",
      content: `<mj-divider border-color="#e5e7eb" />`,
    });

    bm.add("mj-spacer", {
      label: "Spacer",
      category: "Content",
      content: `<mj-spacer height="20px" />`,
    });

    bm.add("mj-social", {
      label: "Social Links",
      category: "Content",
      content: `<mj-social font-size="12px" icon-size="24px" mode="horizontal">
        <mj-social-element name="facebook" href="#" />
        <mj-social-element name="twitter" href="#" />
        <mj-social-element name="linkedin" href="#" />
      </mj-social>`,
    });

    editor.on("load", () => {
      setIsReady(true);

      // Load initial content
      if (value) {
        editor.setComponents(value);
        lastValueRef.current = value;
      } else {
        // Default empty template
        editor.setComponents(`
          <mjml>
            <mj-body background-color="#f4f4f4">
              <mj-section background-color="#ffffff" padding="20px">
                <mj-column>
                  <mj-text font-size="18px" color="#333333" font-family="Arial, sans-serif">
                    Start designing your email here
                  </mj-text>
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>
        `);
      }
    });

    // Listen for changes and notify parent
    editor.on("component:update", () => {
      const content = editor.getHtml();
      if (content !== lastValueRef.current) {
        lastValueRef.current = content;
        onChange(content);
      }
    });

    editor.on("component:add", () => {
      const content = editor.getHtml();
      if (content !== lastValueRef.current) {
        lastValueRef.current = content;
        onChange(content);
      }
    });

    editor.on("component:remove", () => {
      const content = editor.getHtml();
      if (content !== lastValueRef.current) {
        lastValueRef.current = content;
        onChange(content);
      }
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Update content when value prop changes (e.g., template selection)
  useEffect(() => {
    if (editorRef.current && isReady && value !== lastValueRef.current) {
      editorRef.current.setComponents(value);
      lastValueRef.current = value;
    }
  }, [value, isReady]);

  const handleDeviceChange = (deviceId: string) => {
    if (editorRef.current) {
      editorRef.current.setDevice(deviceId);
      setCurrentDevice(deviceId);
    }
  };

  const handleUndo = () => {
    editorRef.current?.UndoManager.undo();
  };

  const handleRedo = () => {
    editorRef.current?.UndoManager.redo();
  };

  const handlePreview = () => {
    if (!editorRef.current) return;
    const isActive = editorRef.current.Commands.isActive("preview");
    if (isActive) {
      editorRef.current.Commands.stop("preview");
    } else {
      editorRef.current.Commands.run("preview");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden bg-background flex flex-col",
        isFullscreen && "fixed inset-4 z-50 shadow-2xl",
        className
      )}
      style={{ height: isFullscreen ? "calc(100vh - 2rem)" : "600px" }}
    >
      {/* Toolbar */}
      <div className="h-12 border-b bg-muted/30 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Device switcher */}
          <div className="flex items-center gap-0.5 bg-background border rounded-md p-0.5">
            <Button
              variant={currentDevice === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => handleDeviceChange("desktop")}
              title="Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={currentDevice === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => handleDeviceChange("tablet")}
              title="Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={currentDevice === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => handleDeviceChange("mobile")}
              title="Mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleUndo}
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRedo}
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePreview}
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Blocks sidebar */}
        <div className="w-48 border-r bg-muted/20 overflow-y-auto shrink-0">
          <div className="p-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
            Blocks
          </div>
          <div
            id="campaign-blocks-container"
            className="p-2 grid grid-cols-2 gap-1.5 [&_.gjs-block]:w-full [&_.gjs-block]:min-h-[60px] [&_.gjs-block]:border [&_.gjs-block]:border-border [&_.gjs-block]:rounded-md [&_.gjs-block]:flex [&_.gjs-block]:flex-col [&_.gjs-block]:items-center [&_.gjs-block]:justify-center [&_.gjs-block]:bg-background [&_.gjs-block]:hover:border-primary [&_.gjs-block]:cursor-grab [&_.gjs-block]:transition-colors [&_.gjs-block]:text-xs [&_.gjs-block-label]:text-[10px] [&_.gjs-block-label]:mt-1"
          />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-muted/30">
          <div
            ref={containerRef}
            className="h-full w-full [&_.gjs-cv-canvas]:bg-muted/30"
          />
        </div>
      </div>

      {/* Global styles for GrapeJS */}
      <style jsx global>{`
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
        .gjs-pn-panel {
          display: none !important;
        }
        #campaign-blocks-container .gjs-block svg {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>
  );
}
