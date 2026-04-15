import { Extension } from '@tiptap/core';
import Suggestion, { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { FieldSuggestionList, FieldSuggestionListRef, NameField } from './FieldSuggestionList';

export const FieldSuggestionPluginKey = new PluginKey('fieldSuggestion');

export function createFieldSuggestionExtension(nameFields: NameField[]) {
  return Extension.create({
    name: 'fieldSuggestion',

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char: '{',
          pluginKey: FieldSuggestionPluginKey,
          allowSpaces: false,
          allowedPrefixes: null, // trigger anywhere, not just after whitespace

          items: ({ query }: { query: string }) => {
            const q = query.toLowerCase();
            return nameFields.filter(
              (f) =>
                f.name.toLowerCase().includes(q) ||
                f.fieldKey.toLowerCase().includes(q)
            );
          },

          command: ({
            editor,
            range,
            props,
          }: {
            editor: any;
            range: any;
            props: NameField;
          }) => {
            // Delete the trigger text ({query) and insert {{fieldKey}}
            editor
              .chain()
              .focus()
              .insertContentAt(range, `{{${props.fieldKey}}}`)
              .run();
          },

          render: () => {
            let container: HTMLDivElement | null = null;
            let reactRoot: ReturnType<typeof createRoot> | null = null;
            let componentRef: FieldSuggestionListRef | null = null;

            const getPosition = (clientRect: (() => DOMRect | null) | null): { top: number; left: number } => {
              const rect = clientRect?.();
              if (!rect) return { top: 0, left: 0 };
              const POPUP_HEIGHT = 200;
              const spaceBelow = window.innerHeight - rect.bottom;
              const top =
                spaceBelow > POPUP_HEIGHT
                  ? rect.bottom + window.scrollY + 4
                  : rect.top + window.scrollY - POPUP_HEIGHT - 4;
              return { top, left: rect.left + window.scrollX };
            };

            const renderComponent = (props: SuggestionProps<NameField>) => {
              if (!container || !reactRoot) return;
              const { top, left } = getPosition(props.clientRect ?? null);
              container.style.top = `${top}px`;
              container.style.left = `${left}px`;

              reactRoot.render(
                createElement(FieldSuggestionList, {
                  items: props.items as NameField[],
                  command: (item: NameField) => props.command(item),
                  ref: (ref: FieldSuggestionListRef | null) => {
                    componentRef = ref;
                  },
                })
              );
            };

            return {
              onStart(props: SuggestionProps<NameField>) {
                container = document.createElement('div');
                container.style.cssText = `
                  position: absolute;
                  z-index: 9999;
                `;
                document.body.appendChild(container);
                reactRoot = createRoot(container);
                renderComponent(props);
              },

              onUpdate(props: SuggestionProps<NameField>) {
                renderComponent(props);
              },

              onKeyDown(props: SuggestionKeyDownProps) {
                if (props.event.key === 'Escape') {
                  if (container) container.style.display = 'none';
                  return true;
                }
                return componentRef?.onKeyDown(props.event) ?? false;
              },

              onExit() {
                if (reactRoot) {
                  // Defer unmount to avoid React batching issues
                  setTimeout(() => {
                    reactRoot?.unmount();
                    reactRoot = null;
                  }, 0);
                }
                if (container) {
                  document.body.removeChild(container);
                  container = null;
                }
                componentRef = null;
              },
            };
          },
        }),
      ];
    },
  });
}
