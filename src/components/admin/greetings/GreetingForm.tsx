'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import {
    CreateGreetingDTO,
    Greeting,
    GREETING_TOKENS,
    GREETING_TOKEN_LABELS,
    UpdateGreetingDTO,
    findInvalidGreetingTokens,
    GreetingToken,
} from '@/types/entities/greeting.types';
import { Code } from 'lucide-react';

const greetingFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters'),
    template: z
        .string()
        .min(1, 'Template is required')
        .max(500, 'Template must be less than 500 characters')
        .superRefine((template, ctx) => {
            const invalid = findInvalidGreetingTokens(template);
            if (invalid.length > 0) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Invalid token(s): ${invalid
                        .map((t) => `{{${t}}}`)
                        .join(', ')}. Allowed: ${GREETING_TOKENS.map(
                        (t) => `{{${t}}}`
                    ).join(', ')}`,
                });
            }
        }),
    isActive: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
});

type GreetingFormValues = z.infer<typeof greetingFormSchema>;

interface GreetingFormProps {
    greeting?: Greeting;
    onSubmit: (data: CreateGreetingDTO | UpdateGreetingDTO) => void | Promise<void>;
    loading?: boolean;
    onCancel?: () => void;
}

export function GreetingForm({ greeting, onSubmit, loading, onCancel }: GreetingFormProps) {
    const templateRef = useRef<HTMLTextAreaElement | null>(null);

    const form = useForm<GreetingFormValues>({
        resolver: zodResolver(greetingFormSchema),
        defaultValues: {
            name: greeting?.name ?? '',
            template: greeting?.template ?? '',
            isActive: greeting?.isActive ?? true,
            displayOrder: greeting?.displayOrder ?? 0,
        },
    });

    useEffect(() => {
        if (greeting) {
            form.reset({
                name: greeting.name,
                template: greeting.template,
                isActive: greeting.isActive,
                displayOrder: greeting.displayOrder,
            });
        }
    }, [greeting, form]);

    const insertToken = (token: GreetingToken) => {
        const ta = templateRef.current;
        const current = form.getValues('template') ?? '';
        const insertion = `{{${token}}}`;

        if (ta && document.activeElement === ta) {
            const start = ta.selectionStart ?? current.length;
            const end = ta.selectionEnd ?? current.length;
            const next = current.slice(0, start) + insertion + current.slice(end);
            form.setValue('template', next, { shouldValidate: true, shouldDirty: true });
            requestAnimationFrame(() => {
                ta.focus();
                const caret = start + insertion.length;
                ta.setSelectionRange(caret, caret);
            });
        } else {
            form.setValue('template', current + insertion, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const handleSubmit = (values: GreetingFormValues) => {
        onSubmit(values);
    };

    const templateValue = form.watch('template');
    const previewValue = templateValue
        .replace(/\{\{\s*firstName\s*\}\}/g, 'John')
        .replace(/\{\{\s*lastName\s*\}\}/g, 'Doe')
        .replace(/\{\{\s*fullName\s*\}\}/g, 'John Doe')
        .replace(/\{\{\s*email\s*\}\}/g, 'john@example.com');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Friendly first-name" {...field} />
                            </FormControl>
                            <FormDescription>
                                Internal label shown to clients in the greeting picker
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Template</FormLabel>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button type="button" variant="outline" size="sm">
                                            <Code className="mr-2 h-3 w-3" />
                                            Insert token
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Available tokens</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {GREETING_TOKENS.map((token) => (
                                            <DropdownMenuItem
                                                key={token}
                                                onClick={() => insertToken(token)}
                                            >
                                                <span className="font-mono mr-2">{`{{${token}}}`}</span>
                                                <span className="text-xs text-gray-500">
                                                    {GREETING_TOKEN_LABELS[token]}
                                                </span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <FormControl>
                                <Textarea
                                    placeholder="Hello {{firstName}},"
                                    rows={3}
                                    {...field}
                                    ref={(el) => {
                                        templateRef.current = el;
                                        field.ref(el);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Use{' '}
                                {GREETING_TOKENS.map((t) => (
                                    <code key={t} className="bg-gray-100 px-1 mx-0.5 rounded">{`{{${t}}}`}</code>
                                ))}{' '}
                                to personalize.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {templateValue && (
                    <div className="rounded-md border bg-gray-50 p-3">
                        <p className="text-xs uppercase text-gray-500 mb-1">Preview</p>
                        <p className="text-sm">{previewValue}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="displayOrder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display order</FormLabel>
                                <FormControl>
                                    <Input type="number" step="1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Active</FormLabel>
                                <FormControl>
                                    <div className="flex items-center h-10">
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            {field.value ? 'Visible to clients' : 'Hidden'}
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading
                            ? greeting
                                ? 'Updating...'
                                : 'Creating...'
                            : greeting
                              ? 'Update Greeting'
                              : 'Create Greeting'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
