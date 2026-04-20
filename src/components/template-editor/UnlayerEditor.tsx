'use client';

import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import type { UnlayerEditor } from '@unlayer/types';

export interface UnlayerEditorHandle {
  exportHtml: () => Promise<{ design: object; html: string }>;
  saveDesign: () => Promise<object>;
  loadDesign: (design: object) => void;
}

interface UnlayerEditorProps {
  onReady?: () => void;
  initialDesign?: object;
  minHeight?: number | string;
}

const UnlayerEditorComponent = forwardRef<UnlayerEditorHandle, UnlayerEditorProps>(
  ({ onReady, initialDesign, minHeight = 'calc(100vh - 220px)' }, ref) => {
    const editorRef = useRef<EditorRef>(null);
    const instanceRef = useRef<UnlayerEditor | null>(null);

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
        onReady?.();
      },
      [initialDesign, onReady]
    );

    const options: EmailEditorProps['options'] = {
      displayMode: 'email',
      appearance: {
        theme: 'modern_light',
        panels: {
          tools: {
            dock: 'left',
          },
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
        image: { enabled: true },
        button: { enabled: true },
        text: { enabled: true },
        divider: { enabled: true },
        html: { enabled: true },
        video: { enabled: true },
        social: { enabled: true },
        timer: { enabled: true },
        heading: { enabled: true },
        menu: { enabled: true },
      },
      mergeTags: {
        firstName: { name: 'First Name', value: '{{firstName}}', sample: 'John' },
        lastName: { name: 'Last Name', value: '{{lastName}}', sample: 'Doe' },
        email: { name: 'Email', value: '{{email}}', sample: 'john@example.com' },
        unsubscribeUrl: { name: 'Unsubscribe Link', value: '{{unsubscribeUrl}}', sample: 'https://example.com/unsubscribe' },
        companyName: { name: 'Company Name', value: '{{companyName}}', sample: 'BEE Smart Campaigns' },
      } as any,
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
