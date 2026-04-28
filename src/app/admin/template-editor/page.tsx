'use client';

import { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Download,
  Code2,
  Save,
  Upload,
  Copy,
  Check,
  ChevronDown,
  LayoutTemplate,
  Sparkles,
  Info,
  CheckCircle2,
  Type,
  ImageIcon,
  MousePointerClick,
  Minus,
  Code,
  Video,
  Share2,
  Timer,
  Heading,
  Menu,
  Tag,
  Undo2,
  AlignLeft,
  Palette,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { UnlayerEditorHandle } from '@/components/template-editor/UnlayerEditor';

// Dynamically import to avoid SSR issues (Unlayer requires browser APIs)
const UnlayerEditor = dynamic(
  () => import('@/components/template-editor/UnlayerEditor'),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

function EditorSkeleton() {
  return (
    <div className="flex-1 bg-muted animate-pulse flex items-center justify-center min-h-[600px]">
      <div className="text-center space-y-3">
        <LayoutTemplate className="h-12 w-12 mx-auto text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Loading drag-and-drop editor…</p>
      </div>
    </div>
  );
}

/**
 * Minimal valid Unlayer design JSONs.
 * null = blank (skip loadDesign entirely — editor starts empty by default).
 * These structures match the JSON produced by editor.saveDesign().
 */
const WELCOME_DESIGN = {
  counters: { u_column: 3, u_row: 3, u_content_text: 3, u_content_button: 1 },
  body: {
    rows: [
      {
        cells: [1],
        columns: [
          {
            contents: [
              {
                type: 'text',
                values: {
                  containerPadding: '24px 40px',
                  textAlign: 'center',
                  lineHeight: '140%',
                  text: '<p style="font-size:22px;font-weight:bold;color:#ffffff;margin:0;">BEE Smart Campaigns</p>',
                },
              },
            ],
            values: { backgroundColor: '#667eea', padding: '0px', border: {} },
          },
        ],
        values: {
          backgroundColor: '#667eea',
          columnsBackgroundColor: '#667eea',
          backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
          padding: '0px',
        },
      },
      {
        cells: [1],
        columns: [
          {
            contents: [
              {
                type: 'text',
                values: {
                  containerPadding: '30px 40px 10px',
                  textAlign: 'left',
                  lineHeight: '150%',
                  text: "<h2 style=\"margin:0 0 12px;color:#333;font-size:24px;\">Hello {{firstName}}! \uD83D\uDC4B</h2><p style=\"margin:0;color:#555;font-size:15px;\">Welcome to <strong>BEE Smart Campaigns</strong>. We're excited to have you on board.</p>",
                },
              },
              {
                type: 'button',
                values: {
                  containerPadding: '20px 40px 30px',
                  textAlign: 'left',
                  text: 'Get Started →',
                  action: { name: 'web', values: { href: '{{callToActionUrl}}', target: '_blank' } },
                  backgroundColor: '#667eea',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                },
              },
            ],
            values: { backgroundColor: '#ffffff', padding: '0px', border: {} },
          },
        ],
        values: {
          backgroundColor: '#f4f4f4',
          columnsBackgroundColor: '#ffffff',
          backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
          padding: '0px',
        },
      },
      {
        cells: [1],
        columns: [
          {
            contents: [
              {
                type: 'text',
                values: {
                  containerPadding: '16px 40px',
                  textAlign: 'center',
                  lineHeight: '150%',
                  text: '<p style="margin:0;font-size:12px;color:#999;">© 2025 {{companyName}} &nbsp;·&nbsp; <a href="{{unsubscribeUrl}}" style="color:#999;">Unsubscribe</a></p>',
                },
              },
            ],
            values: { backgroundColor: '#f4f4f4', padding: '0px', border: {} },
          },
        ],
        values: {
          backgroundColor: '#f4f4f4',
          columnsBackgroundColor: '#f4f4f4',
          backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
          padding: '0px',
        },
      },
    ],
    values: {
      backgroundColor: '#f4f4f4',
      backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
      contentWidth: '600px',
      contentAlign: 'center',
      fontFamily: { label: 'Arial', value: 'arial,helvetica,sans-serif' },
      preheaderText: 'Welcome to BEE Smart Campaigns!',
      linkStyle: {
        body: true,
        linkColor: '#0000ee',
        linkHoverColor: '#0000ee',
        linkUnderline: true,
        linkHoverUnderline: true,
      },
    },
  },
};

const NEWSLETTER_DESIGN = {
  counters: { u_column: 1, u_row: 2, u_content_text: 2 },
  body: {
    rows: [
      {
        cells: [1],
        columns: [
          {
            contents: [
              {
                type: 'text',
                values: {
                  containerPadding: '30px 40px 10px',
                  textAlign: 'left',
                  lineHeight: '150%',
                  text: '<h1 style="margin:0 0 8px;color:#222;font-size:28px;">Monthly Newsletter</h1><p style="margin:0;color:#777;font-size:13px;text-transform:uppercase;letter-spacing:1px;">April 2025</p>',
                },
              },
            ],
            values: { backgroundColor: '#ffffff', padding: '0px', border: {} },
          },
        ],
        values: {
          backgroundColor: '#ffffff',
          columnsBackgroundColor: '#ffffff',
          backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
          padding: '0px',
        },
      },
      {
        cells: [1],
        columns: [
          {
            contents: [
              {
                type: 'text',
                values: {
                  containerPadding: '10px 40px 30px',
                  textAlign: 'left',
                  lineHeight: '160%',
                  text: '<p style="margin:0;color:#444;font-size:15px;">Hi {{firstName}},</p><br><p style="margin:0;color:#444;font-size:15px;">Here is your monthly update from {{companyName}}. We have exciting news to share this month.</p><br><p style="margin:0;font-size:12px;color:#aaa;">Don\'t want these emails? <a href="{{unsubscribeUrl}}" style="color:#aaa;">Unsubscribe</a></p>',
                },
              },
            ],
            values: { backgroundColor: '#ffffff', padding: '0px', border: {} },
          },
        ],
        values: {
          backgroundColor: '#ffffff',
          columnsBackgroundColor: '#ffffff',
          backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
          padding: '0px',
        },
      },
    ],
    values: {
      backgroundColor: '#eeeeee',
      backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
      contentWidth: '600px',
      contentAlign: 'center',
      fontFamily: { label: 'Arial', value: 'arial,helvetica,sans-serif' },
      linkStyle: {
        body: true,
        linkColor: '#667eea',
        linkHoverColor: '#667eea',
        linkUnderline: true,
        linkHoverUnderline: true,
      },
    },
  },
};

const BLANK_DESIGN = {
  counters: {},
  body: {
    rows: [],
    values: {
      backgroundColor: '#ffffff',
      backgroundImage: { url: '', fullWidth: true, repeat: false, center: true, cover: false },
      contentWidth: '600px',
      contentAlign: 'center',
      fontFamily: { label: 'Arial', value: 'arial,helvetica,sans-serif' },
      linkStyle: {
        body: true,
        linkColor: '#0000ee',
        linkHoverColor: '#0000ee',
        linkUnderline: true,
        linkHoverUnderline: true,
      },
    },
  },
};

const STARTER_TEMPLATES: Record<string, object> = {
  blank: BLANK_DESIGN,
  welcome: WELCOME_DESIGN,
  newsletter: NEWSLETTER_DESIGN,
};

export default function AdminTemplateEditorPage() {
  const editorRef = useRef<UnlayerEditorHandle>(null);
  const [isReady, setIsReady] = useState(false);
  const [templateName, setTemplateName] = useState('my-template');
  const [exportedHtml, setExportedHtml] = useState<string | null>(null);
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false);
  const [featuresDialogOpen, setFeaturesDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReady = useCallback(() => {
    setIsReady(true);
    toast.success('Editor ready', { description: 'Drag and drop to build your email.' });
  }, []);

  const handleExportHtml = useCallback(async () => {
    try {
      const { html } = await editorRef.current!.exportHtml();
      setExportedHtml(html);
      setHtmlDialogOpen(true);
    } catch {
      toast.error('Export failed', { description: 'Editor is not ready yet.' });
    }
  }, []);

  const handleSaveDesign = useCallback(async () => {
    try {
      const design = await editorRef.current!.saveDesign();
      const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateName}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Design saved', { description: `Downloaded as ${templateName}.json` });
    } catch {
      toast.error('Save failed', { description: 'Editor is not ready yet.' });
    }
  }, [templateName]);

  const handleDownloadHtml = useCallback(async () => {
    try {
      const { html } = await editorRef.current!.exportHtml();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateName}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('HTML downloaded', { description: `Saved as ${templateName}.html` });
    } catch {
      toast.error('Export failed', { description: 'Editor is not ready yet.' });
    }
  }, [templateName]);

  const handleLoadTemplate = useCallback((key: string) => {
    const design = STARTER_TEMPLATES[key];
    if (design) {
      editorRef.current?.loadDesign(design);
    }
    toast.success(key === 'blank' ? 'Canvas cleared' : `Loaded "${key}" template`);
  }, []);

  const handleLoadDesignFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const design = JSON.parse(evt.target?.result as string);
        editorRef.current?.loadDesign(design);
        setTemplateName(file.name.replace(/\.json$/, ''));
        toast.success('Design loaded', { description: file.name });
      } catch {
        toast.error('Invalid JSON', { description: 'Could not parse the design file.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleCopyHtml = useCallback(() => {
    if (!exportedHtml) return;
    navigator.clipboard.writeText(exportedHtml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [exportedHtml]);

  return (
    <div className="flex flex-col h-full -mx-4 -mt-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b bg-background shrink-0">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm hidden sm:inline">Template Editor</span>
          {isReady && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-300 hidden md:flex">
              Ready
            </Badge>
          )}
        </div>

        <Input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="h-8 w-40 text-xs"
          placeholder="template-name"
        />

        <div className="flex items-center gap-2">
          {/* Features Info */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => setFeaturesDialogOpen(true)}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Features</span>
          </Button>

          {/* Starter Templates */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1" disabled={!isReady}>
                <LayoutTemplate className="h-4 w-4" />
                <span className="hidden sm:inline">Starters</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Starter Templates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLoadTemplate('welcome')}>
                Welcome Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLoadTemplate('newsletter')}>
                Newsletter
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLoadTemplate('blank')}>
                Blank Canvas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Load Design JSON */}
          <Button variant="outline" size="sm" className="h-8 gap-1" disabled={!isReady} asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Load</span>
              <input type="file" accept=".json" className="hidden" onChange={handleLoadDesignFile} />
            </label>
          </Button>

          {/* View HTML */}
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExportHtml} disabled={!isReady}>
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">HTML</span>
          </Button>

          {/* Save Design JSON */}
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleSaveDesign} disabled={!isReady}>
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          {/* Download HTML */}
          <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90" onClick={handleDownloadHtml} disabled={!isReady}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Info bar */}
      <div className="px-4 py-2 bg-muted/50 border-b flex flex-wrap items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span>Drag blocks from the left panel into the canvas.</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">
          Use merge tags like <code className="bg-muted px-1 rounded">{'{{firstName}}'}</code> for personalisation.
        </span>
        <span className="hidden md:inline">·</span>
        <span className="hidden md:inline">Save as JSON to reload the design later. Export as HTML to use in campaigns.</span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <UnlayerEditor
          ref={editorRef}
          onReady={handleReady}
          minHeight="calc(100vh - 148px)"
        />
      </div>

      {/* Features Dialog */}
      <Dialog open={featuresDialogOpen} onOpenChange={setFeaturesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Editor — Available Features
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              Design your email visually, export the HTML, and use it directly in campaigns.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1">

            {/* Content Blocks */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Content Blocks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { icon: Type,             label: 'Text',     desc: 'Rich text with bold, italic, links, lists and inline styles.' },
                  { icon: Heading,          label: 'Heading',  desc: 'H1–H4 headings with custom size, weight and colour.' },
                  { icon: ImageIcon,        label: 'Image',    desc: 'Upload or link images; set alt text, link, and alignment.' },
                  { icon: MousePointerClick,label: 'Button',   desc: 'CTA button with custom colour, radius, padding and link.' },
                  { icon: Minus,            label: 'Divider',  desc: 'Horizontal rule with adjustable height, colour and style.' },
                  { icon: Code,             label: 'HTML',     desc: 'Raw HTML block for custom code snippets.' },
                  { icon: Video,            label: 'Video',    desc: 'Embed YouTube / Vimeo with a clickable thumbnail.' },
                  { icon: Share2,           label: 'Social',   desc: 'Social icons (Facebook, Twitter, LinkedIn, etc.) with links.' },
                  { icon: Timer,            label: 'Timer',    desc: 'Animated countdown timer for limited-time offers.' },
                  { icon: Menu,             label: 'Menu',     desc: 'Navigation menu bar with multiple link items.' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Editor Capabilities */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Editor Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { icon: Palette,    label: 'Appearance themes',    desc: 'Modern Light theme; customise panel, fonts and colours.' },
                  { icon: Undo2,      label: 'Undo / Redo',          desc: 'Full undo/redo history while designing.' },
                  { icon: AlignLeft,  label: 'Preheader text',       desc: 'Set the preview text that appears in inboxes.' },
                  { icon: Type,       label: 'Spell checker',        desc: 'Built-in spell check inside the text editor.' },
                  { icon: Type,       label: 'Tables in text',       desc: 'Insert and edit HTML tables within text blocks.' },
                  { icon: Sparkles,   label: 'Emojis',               desc: 'Insert emojis directly from the text toolbar.' },
                  { icon: Smartphone, label: 'Mobile preview',       desc: 'Toggle desktop / mobile view while designing.' },
                  { icon: Code,       label: 'Export HTML',          desc: 'Export production-ready, inlined HTML at any time.' },
                  { icon: Save,       label: 'Save & reload design', desc: 'Save design as JSON and reload it in any future session.' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Merge Tags */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Personalisation — Merge Tags
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Click the <strong>Merge Tags</strong> button inside any text block to insert dynamic values. These map to your contact fields at send time.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '{{firstName}}', '{{lastName}}', '{{email}}',
                  '{{companyName}}', '{{unsubscribeUrl}}',
                ].map((tag) => (
                  <code key={tag} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-mono border">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    {tag}
                  </code>
                ))}
              </div>
            </section>

            {/* Workflow */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Recommended Workflow
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-none">
                {[
                  'Pick a starter from "Starters" or drag blocks onto the blank canvas.',
                  'Customise colours, fonts, images and copy using the right-hand property panel.',
                  'Insert merge tags (e.g. {{firstName}}) inside text blocks for personalisation.',
                  'Use "Save" to download the design as JSON — reload it later with "Load".',
                  'Use "Export" to download the final HTML and attach it to a campaign.',
                  'Use "HTML" to preview and copy the raw HTML code.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

          </div>
        </DialogContent>
      </Dialog>

      {/* HTML Preview Dialog */}
      <Dialog open={htmlDialogOpen} onOpenChange={setHtmlDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-row items-center justify-between space-y-0 pr-8">
            <DialogTitle>Exported HTML</DialogTitle>
            <Button variant="outline" size="sm" className="h-7 gap-1" onClick={handleCopyHtml}>
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-auto mt-2">
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap break-all">
              {exportedHtml}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
