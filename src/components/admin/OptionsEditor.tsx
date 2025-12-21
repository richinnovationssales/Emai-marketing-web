'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OptionsEditorProps {
    value: string; // JSON string array
    onChange: (value: string) => void;
    placeholder?: string;
}

export function OptionsEditor({ value, onChange, placeholder = "Add option" }: OptionsEditorProps) {
    const [newOption, setNewOption] = useState('');
    const [options, setOptions] = useState<string[]>(() => {
        try {
            return value ? JSON.parse(value) : [];
        } catch {
            return [];
        }
    });

    const updateOptions = (updatedOptions: string[]) => {
        setOptions(updatedOptions);
        onChange(JSON.stringify(updatedOptions));
    };

    const addOption = () => {
        if (newOption.trim()) {
            const updatedOptions = [...options, newOption.trim()];
            updateOptions(updatedOptions);
            setNewOption('');
        }
    };

    const removeOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        updateOptions(updatedOptions);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addOption();
        }
    };

    return (
        <div className="space-y-3">
            <Label>Options</Label>
            <div className="flex gap-2">
                <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button 
                    type="button" 
                    onClick={addOption} 
                    size="sm"
                    disabled={!newOption.trim()}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            
            {options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {options.map((option, index) => (
                        <Badge 
                            key={index} 
                            variant="secondary" 
                            className="flex items-center gap-1 px-2 py-1"
                        >
                            {option}
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            
            {options.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No options added yet. Add at least one option for select fields.
                </p>
            )}
        </div>
    );
}
