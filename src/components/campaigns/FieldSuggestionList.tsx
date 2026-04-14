'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface NameField {
  id: string;
  name: string;
  fieldKey: string;
}

interface FieldSuggestionListProps {
  items: NameField[];
  command: (item: NameField) => void;
}

export interface FieldSuggestionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const FieldSuggestionList = forwardRef<FieldSuggestionListRef, FieldSuggestionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Reset selection when items change
    useEffect(() => setSelectedIndex(0), [items]);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) command(item);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((i) => (i + items.length - 1) % items.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (!items.length) {
      return (
        <div className="z-50 min-w-[180px] rounded-md border bg-popover p-1 shadow-md">
          <p className="px-2 py-1.5 text-xs text-muted-foreground">No name fields found</p>
        </div>
      );
    }

    return (
      <div className="z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover shadow-md">
        <div className="p-1">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Name Fields
          </p>
          {items.map((item, index) => (
            <button
              key={item.id}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                index === selectedIndex ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => selectItem(index)}
            >
              <span className="font-medium">{item.name}</span>
              <code className="ml-auto text-[10px] text-muted-foreground bg-muted px-1 rounded">
                {`{{${item.fieldKey}}}`}
              </code>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

FieldSuggestionList.displayName = 'FieldSuggestionList';
