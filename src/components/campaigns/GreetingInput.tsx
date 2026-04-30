'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Code, Sparkles, X } from 'lucide-react';
import {
    GREETING_TOKENS,
    GREETING_TOKEN_LABELS,
    Greeting,
    GreetingToken,
} from '@/types/entities/greeting.types';
import { cn } from '@/lib/utils/cn';

interface GreetingInputProps {
    value: string;
    greetingId?: string | null;
    onChange: (next: { value: string; greetingId: string | null }) => void;
    greetings: Greeting[];
    disabled?: boolean;
}

export function GreetingInput({
    value,
    greetingId,
    onChange,
    greetings,
    disabled,
}: GreetingInputProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const filtered = useMemo(() => {
        const trimmed = value.trim().toLowerCase();
        if (!trimmed) {
            return greetings.slice(0, 5);
        }
        return greetings
            .filter(
                (g) =>
                    g.name.toLowerCase().includes(trimmed) ||
                    g.template.toLowerCase().includes(trimmed)
            )
            .slice(0, 5);
    }, [greetings, value]);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const setValue = (next: string, nextGreetingId: string | null) => {
        onChange({ value: next, greetingId: nextGreetingId });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Free typing detaches the picked greeting (becomes a one-off snapshot).
        setValue(e.target.value, null);
        setShowSuggestions(true);
        setHighlightedIndex(0);
    };

    const handleSelectSuggestion = (g: Greeting) => {
        setValue(g.template, g.id);
        setShowSuggestions(false);
        requestAnimationFrame(() => {
            inputRef.current?.focus();
            const len = g.template.length;
            inputRef.current?.setSelectionRange(len, len);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || filtered.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const picked = filtered[highlightedIndex];
            if (picked) handleSelectSuggestion(picked);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const insertToken = (token: GreetingToken) => {
        const insertion = `{{${token}}}`;
        const input = inputRef.current;
        if (input && document.activeElement === input) {
            const start = input.selectionStart ?? value.length;
            const end = input.selectionEnd ?? value.length;
            const next = value.slice(0, start) + insertion + value.slice(end);
            setValue(next, greetingId ?? null);
            requestAnimationFrame(() => {
                input.focus();
                const caret = start + insertion.length;
                input.setSelectionRange(caret, caret);
            });
        } else {
            setValue(value + insertion, greetingId ?? null);
        }
    };

    const handleClear = () => {
        setValue('', null);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    return (
        <div ref={containerRef} className="relative space-y-1">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Hello {{firstName}},"
                        disabled={disabled}
                        className={cn(value && 'pr-9')}
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear greeting"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" size="sm" disabled={disabled}>
                            <Code className="mr-1 h-3 w-3" />
                            Token
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Insert token</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {GREETING_TOKENS.map((token) => (
                            <DropdownMenuItem key={token} onClick={() => insertToken(token)}>
                                <span className="font-mono mr-2">{`{{${token}}}`}</span>
                                <span className="text-xs text-muted-foreground">
                                    {GREETING_TOKEN_LABELS[token]}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {showSuggestions && filtered.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 rounded-md border bg-popover shadow-lg overflow-hidden">
                    <div className="px-3 py-1.5 text-xs uppercase text-muted-foreground border-b flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Suggested greetings
                    </div>
                    <ul role="listbox">
                        {filtered.map((g, i) => (
                            <li
                                key={g.id}
                                role="option"
                                aria-selected={i === highlightedIndex}
                                onMouseEnter={() => setHighlightedIndex(i)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectSuggestion(g);
                                }}
                                className={cn(
                                    'px-3 py-2 cursor-pointer text-sm flex flex-col',
                                    i === highlightedIndex && 'bg-accent'
                                )}
                            >
                                <span className="font-medium">{g.name}</span>
                                <code className="text-xs text-muted-foreground">{g.template}</code>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
