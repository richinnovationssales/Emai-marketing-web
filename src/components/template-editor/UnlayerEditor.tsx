'use client';

import {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import type { UnlayerEditor } from '@unlayer/types';

export interface UnlayerMergeTag {
  name: string;
  value: string;
  sample?: string;
}

export interface UnlayerEditorHandle {
  exportHtml: () => Promise<{ design: object; html: string }>;
  saveDesign: () => Promise<object>;
  loadDesign: (design: object) => void;
}

interface UnlayerEditorProps {
  onReady?: () => void;
  /** Fires once Unlayer reports any change to the design. */
  onDesignUpdate?: () => void;
  initialDesign?: object | null;
  minHeight?: number | string;
  mergeTags?: Record<string, UnlayerMergeTag>;
}

const DEFAULT_MERGE_TAGS: Record<string, UnlayerMergeTag> = {
  firstName:      { name: 'First Name',       value: '{{firstName}}',      sample: 'John' },
  lastName:       { name: 'Last Name',        value: '{{lastName}}',       sample: 'Doe' },
  email:          { name: 'Email',            value: '{{email}}',          sample: 'john@example.com' },
  companyName:    { name: 'Company Name',     value: '{{companyName}}',    sample: 'BEE Smart Campaigns' },
  unsubscribeUrl: { name: 'Unsubscribe Link', value: '{{unsubscribeUrl}}', sample: 'https://example.com/unsubscribe' },
};

const UnlayerEditorComponent = forwardRef<UnlayerEditorHandle, UnlayerEditorProps>(
  ({ onReady, onDesignUpdate, initialDesign, minHeight = 'calc(100vh - 220px)', mergeTags }, ref) => {
    const editorRef   = useRef<EditorRef>(null);
    const instanceRef = useRef<UnlayerEditor | null>(null);
    // Latest callback in a ref so the design:updated subscription is stable.
    const onDesignUpdateRef = useRef<typeof onDesignUpdate>(onDesignUpdate);
    useEffect(() => {
      onDesignUpdateRef.current = onDesignUpdate;
    }, [onDesignUpdate]);

    // Built-in defaults always win over caller-supplied tags so a custom
    // field with fieldKey 'email' (or any other built-in key) can't silently
    // shadow {{email}} / {{firstName}} / etc.
    const finalMergeTags = useMemo(
      () => ({ ...(mergeTags ?? {}), ...DEFAULT_MERGE_TAGS }),
      [mergeTags]
    );

    useImperativeHandle(ref, () => ({
      exportHtml: () =>
        new Promise((resolve, reject) => {
          const editor = instanceRef.current ?? editorRef.current?.editor;
          if (!editor) { reject(new Error('Editor not ready')); return; }
          editor.exportHtml((data) => {
            resolve({ design: data.design as object, html: data.html });
          });
        }),

      saveDesign: () =>
        new Promise((resolve, reject) => {
          const editor = instanceRef.current ?? editorRef.current?.editor;
          if (!editor) { reject(new Error('Editor not ready')); return; }
          editor.saveDesign((design) => {
            resolve(design as object);
          });
        }),

      loadDesign: (design: object) => {
        const editor = instanceRef.current ?? editorRef.current?.editor;
        editor?.loadDesign(design as any);
      },
    }));

    const handleReady = useCallback(
      (unlayer: UnlayerEditor) => {
        instanceRef.current = unlayer;
        if (initialDesign && Object.keys(initialDesign).length > 0) {
          unlayer.loadDesign(initialDesign as any);
        }
        // Subscribe to design changes for the host's dirty tracking.
        // loadDesign() above also fires design:updated; the host gates
        // dirty-marking on its own designReadyRef so the initial echo is
        // ignored. No try/catch — if Unlayer ever renames this event, we
        // want to fail loud rather than silently break the unsaved guard.
        (unlayer as unknown as {
          addEventListener: (evt: string, cb: () => void) => void;
        }).addEventListener('design:updated', () => {
          onDesignUpdateRef.current?.();
        });
        onReady?.();
      },
      [initialDesign, onReady]
    );

    // mergeTags are read once at init by react-email-editor; the host
    // (TemplateEditor) gates mounting on useCustomFields() resolving so the
    // initial value is final.
    const options: EmailEditorProps['options'] = {
      displayMode: 'email',
      appearance: {
        theme: 'modern_light',
        panels: {
          tools: { dock: 'left' },
        },
      },
      features: {
        textEditor: {
          spellChecker: true,
          tables: true,
          emojis: true,
        },
        preheaderText: true,
        undoRedo: true,
      },
      tools: {
        image:   { enabled: true },
        button:  { enabled: true },
        text:    { enabled: true },
        divider: { enabled: true },
        html:    { enabled: true },
        video:   { enabled: true },
        social:  { enabled: true },
        timer:   { enabled: true },
        heading: { enabled: true },
        menu:    { enabled: true },
      },
      mergeTags: finalMergeTags as any,
    };

    return (
      <EmailEditor
        ref={editorRef}
        onReady={handleReady as any}
        options={options}
        style={{ minHeight }}
      />
    );
  }
);

UnlayerEditorComponent.displayName = 'UnlayerEditor';

export default UnlayerEditorComponent;
