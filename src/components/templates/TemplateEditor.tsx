"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Save,
  Download,
  Loader2,
  FileCode2,
  Sparkles,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import type {
  UnlayerEditorHandle,
  UnlayerMergeTag,
} from "@/components/template-editor/UnlayerEditor";
import { useCustomFields } from "@/lib/api/hooks/useCustomFields";

// Dynamically import Unlayer to avoid SSR issues (it requires window).
const UnlayerEditor = dynamic(
  () => import("@/components/template-editor/UnlayerEditor"),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

function EditorSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/30 min-h-[480px]">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading drag &amp; drop editor…
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public API (kept identical so create/edit pages don't change)
// ---------------------------------------------------------------------------
export interface TemplateEditorProps {
  templateId?: string;
  initialName?: string;
  initialSubject?: string;
  initialContent?: string;
  onSave?: (data: { name: string; subject: string; content: string }) => void;
  isSaving?: boolean;
  /** Where Cancel navigates to. Defaults to /client/templates. */
  cancelHref?: string;
}

// ---------------------------------------------------------------------------
// Embed the Unlayer design JSON inside the saved HTML so we can re-open
// templates in the visual editor without changing the API contract.
//
//   <!--BEE_DESIGN:base64(JSON)-->
//
// stripDesignMarker() must be called wherever template.content is consumed
// for preview / send so recipients don't receive the design payload.
// ---------------------------------------------------------------------------
const DESIGN_PREFIX = "<!--BEE_DESIGN:";
const DESIGN_SUFFIX = "-->";

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeDesign(design: object): string {
  return utf8ToBase64(JSON.stringify(design));
}

function decodeDesign(content: string): object | null {
  if (!content) return null;
  const trimmed = content.trimStart();
  if (!trimmed.startsWith(DESIGN_PREFIX)) return null;
  const end = trimmed.indexOf(DESIGN_SUFFIX, DESIGN_PREFIX.length);
  if (end === -1) return null;
  const b64 = trimmed.slice(DESIGN_PREFIX.length, end);
  try {
    return JSON.parse(base64ToUtf8(b64));
  } catch {
    return null;
  }
}

function packContent(html: string, design: object): string {
  return `${DESIGN_PREFIX}${encodeDesign(design)}${DESIGN_SUFFIX}\n${html}`;
}

/**
 * Removes the BEE_DESIGN comment from saved template HTML before it is
 * shown to recipients or merged into a campaign body. Safe on legacy
 * templates that don't carry the marker (returns input unchanged).
 */
export function stripDesignMarker(content: string): string {
  if (!content) return content;
  const trimmed = content.trimStart();
  if (!trimmed.startsWith(DESIGN_PREFIX)) return content;
  const end = trimmed.indexOf(DESIGN_SUFFIX, DESIGN_PREFIX.length);
  if (end === -1) return content;
  return trimmed.slice(end + DESIGN_SUFFIX.length).replace(/^\s+/, "");
}

function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function isDesignEmpty(design: unknown): boolean {
  const rows = (design as { body?: { rows?: unknown[] } } | undefined)?.body?.rows;
  return !Array.isArray(rows) || rows.length === 0;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TemplateEditor({
  initialName = "",
  initialSubject = "",
  initialContent,
  onSave,
  isSaving = false,
  cancelHref = "/client/templates",
}: TemplateEditorProps) {
  const router = useRouter();
  const editorRef = useRef<UnlayerEditorHandle>(null);
  // Armed ~500 ms after isReady. Until then, ignore design:updated events
  // so the iframe's initial-load echo doesn't mark the template dirty
  // before the user has touched anything.
  const designReadyRef = useRef(false);

  const [name, setName] = useState(initialName);
  const [subject, setSubject] = useState(initialSubject);
  const [isReady, setIsReady] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  // Parse the saved HTML once, extract embedded Unlayer design (if any).
  const initialDesign = useMemo(
    () => decodeDesign(initialContent ?? ""),
    [initialContent]
  );

  const hasLegacyContent =
    !!initialContent && initialContent.length > 0 && !initialDesign;

  // Wait for the custom-field query to settle before mounting Unlayer so the
  // initial mergeTags option is final (the editor doesn't accept later updates).
  const { data: customFields, isLoading: customFieldsLoading } =
    useCustomFields();

  const dynamicMergeTags = useMemo<Record<string, UnlayerMergeTag>>(() => {
    if (!customFields?.length) return {};
    const tags: Record<string, UnlayerMergeTag> = {};
    for (const f of customFields) {
      if (!f.isActive || !f.fieldKey) continue;
      tags[f.fieldKey] = {
        name: f.name,
        value: `{{${f.fieldKey}}}`,
        sample: f.name,
      };
    }
    return tags;
  }, [customFields]);

  const handleReady = useCallback(() => {
    setIsReady(true);
    if (hasLegacyContent) {
      toast.message("Legacy template", {
        description:
          "This template was created with the old editor. Rebuild it visually or paste its HTML into an HTML block.",
      });
    } else {
      toast.success("Editor ready", {
        description: "Drag and drop blocks from the left panel.",
      });
    }
  }, [hasLegacyContent]);

  // Arm dirty tracking shortly after the editor reports ready. Unlayer
  // fires design:updated asynchronously after loadDesign() completes, so a
  // synchronous gate inside handleReady wouldn't catch it.
  useEffect(() => {
    if (!isReady) return;
    const t = setTimeout(() => {
      designReadyRef.current = true;
    }, 500);
    return () => clearTimeout(t);
  }, [isReady]);

  // Dirty flag is set directly by the input onChange handlers and by the
  // editor's design:updated callback. The ref gate skips the initial-load
  // echo (see designReadyRef above).
  const handleDesignUpdated = useCallback(() => {
    if (!designReadyRef.current) return;
    setIsDirty(true);
  }, []);

  // Browser-level guard: warn before reload / tab close while there are
  // unsaved changes. SPA navigations (router.push) don't trigger
  // beforeunload, so a successful save → parent navigation unmounts us
  // and the cleanup removes the listener naturally.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleCancel = useCallback(() => {
    if (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Leave the editor and discard them?"
      )
    ) {
      return;
    }
    router.push(cancelHref);
  }, [cancelHref, isDirty, router]);

  const handleExportHtml = useCallback(async () => {
    if (!editorRef.current) return;
    try {
      const { html } = await editorRef.current.exportHtml();
      const filename = (name || "template").replace(/\s+/g, "-").toLowerCase();
      downloadFile(`${filename}.html`, html, "text/html");
      toast.success("HTML exported");
    } catch {
      toast.error("Export failed", { description: "Editor is not ready yet." });
    }
  }, [name]);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    if (!name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }
    if (!editorRef.current) {
      toast.error("Editor not ready");
      return;
    }

    try {
      const { html, design } = await editorRef.current.exportHtml();
      if (isDesignEmpty(design)) {
        toast.error("Add at least one block before saving");
        return;
      }
      const packed = packContent(html, design);
      // Don't optimistically clear isDirty here: if the parent's mutation
      // fails the user keeps editing and the unload guard must stay armed.
      // On success the parent navigates and unmounts us → listener cleans
      // up via the effect's return.
      onSave({ name: name.trim(), subject: subject.trim(), content: packed });
    } catch {
      toast.error("Could not export template HTML");
    }
  }, [name, subject, onSave]);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* ===================== TOOLBAR ===================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode2 className="h-5 w-5 text-primary shrink-0" />
          <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">
            Template Editor
          </span>
          <Badge variant="secondary" className="hidden sm:flex text-xs">
            <Sparkles className="h-3 w-3 mr-1" /> Unlayer
          </Badge>
          {isReady && (
            <Badge
              variant="outline"
              className="hidden md:flex text-xs text-green-600 border-green-300"
            >
              Ready
            </Badge>
          )}
        </div>

        {onSave && (
          <div className="flex items-center gap-2 flex-1 justify-center min-w-[260px] max-w-2xl">
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Template name *"
              aria-label="Template name"
              className="h-8 text-xs"
            />
            <Input
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Email subject *"
              aria-label="Email subject"
              className="h-8 text-xs"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => setFeaturesOpen(true)}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Features</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={handleExportHtml}
            disabled={!isReady}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export HTML</span>
          </Button>

          {onSave && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>

              <Button
                size="sm"
                className="h-8 gap-1.5"
                onClick={handleSave}
                disabled={!isReady || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ===================== INFO STRIP ===================== */}
      <div className="flex flex-wrap items-center gap-4 border-b bg-muted/40 px-4 py-2 text-xs text-muted-foreground shrink-0">
        <span>Drag blocks from the left to start building.</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">
          Insert merge tags like{" "}
          <code className="rounded bg-muted px-1">{"{{firstName}}"}</code> for
          personalisation.
        </span>
      </div>

      {/* ===================== EDITOR ===================== */}
      <div className="flex-1 overflow-hidden">
        {customFieldsLoading ? (
          <EditorSkeleton />
        ) : (
          <UnlayerEditor
            ref={editorRef}
            onReady={handleReady}
            onDesignUpdate={handleDesignUpdated}
            initialDesign={initialDesign}
            mergeTags={dynamicMergeTags}
            minHeight="100%"
          />
        )}
      </div>

      {/* ===================== FEATURES DIALOG ===================== */}
      <Dialog open={featuresOpen} onOpenChange={setFeaturesOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Editor Features
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm">
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Drag &amp; drop blocks
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                {[
                  "Text & Heading",
                  "Image",
                  "Button",
                  "Divider",
                  "HTML",
                  "Video",
                  "Social icons",
                  "Countdown timer",
                  "Menu / nav bar",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Capabilities
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                {[
                  "Mobile / desktop preview",
                  "Undo / redo",
                  "Spell-checker",
                  "Emoji picker",
                  "Inline tables",
                  "Preheader text",
                  "Image upload (CDN)",
                  "Production-ready HTML",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Merge tags
              </p>
              <p className="text-muted-foreground mb-2">
                Click <strong>Merge Tags</strong> inside any text block to
                insert dynamic values. Defaults plus all your active custom
                fields are available.
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set([
                    "{{firstName}}",
                    "{{lastName}}",
                    "{{email}}",
                    "{{companyName}}",
                    "{{unsubscribeUrl}}",
                    ...Object.values(dynamicMergeTags).map((t) => t.value),
                  ])
                ).map((tag) => (
                  <code
                    key={tag}
                    className="rounded-md border bg-muted px-2 py-1 text-xs font-mono"
                  >
                    {tag}
                  </code>
                ))}
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
