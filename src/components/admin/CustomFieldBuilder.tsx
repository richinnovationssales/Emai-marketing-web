'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addCustomField,
    updateCustomField,
    removeCustomField,
    reorderCustomField,
    setUseDefaultFields,
    selectCustomFieldsBuilder,
    selectUseDefaultFields
} from '@/store/slices/admin.slice';
import { CustomFieldDefinition, CustomFieldType } from '@/types/entities/client.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { FieldTypeIcon } from './FieldTypeIcon';
import { OptionsEditor } from './OptionsEditor';

interface CustomFieldBuilderProps {
    className?: string;
}

export function CustomFieldBuilder({ className }: CustomFieldBuilderProps) {
    const dispatch = useAppDispatch();
    const customFields = useAppSelector(selectCustomFieldsBuilder);
    const useDefaultFields = useAppSelector(selectUseDefaultFields);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [fieldForm, setFieldForm] = useState<CustomFieldDefinition>({
        name: '',
        fieldKey: '',
        type: CustomFieldType.TEXT,
        isRequired: false,
        defaultValue: '',
        options: '',
        validationRegex: '',
        helpText: '',
        displayOrder: customFields.length,
    });

    const handleOpenDialog = (index?: number) => {
        if (index !== undefined) {
            setEditingIndex(index);
            setFieldForm(customFields[index]);
        } else {
            setEditingIndex(null);
            setFieldForm({
                name: '',
                fieldKey: '',
                type: CustomFieldType.TEXT,
                isRequired: false,
                defaultValue: '',
                options: '',
                validationRegex: '',
                helpText: '',
                displayOrder: customFields.length,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingIndex(null);
    };

    const handleNameChange = (name: string) => {
        const fieldKey = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
        setFieldForm({ ...fieldForm, name, fieldKey });
    };

    const handleSaveField = () => {
        if (!fieldForm.name || !fieldForm.fieldKey) {
            return;
        }

        // Validate options for SELECT/MULTISELECT
        if ((fieldForm.type === CustomFieldType.SELECT || fieldForm.type === CustomFieldType.MULTISELECT)) {
            try {
                const options = JSON.parse(fieldForm.options || '[]');
                if (options.length === 0) {
                    alert('Please add at least one option for select fields');
                    return;
                }
            } catch {
                alert('Invalid options format');
                return;
            }
        }

        if (editingIndex !== null) {
            dispatch(updateCustomField({ index: editingIndex, field: fieldForm }));
        } else {
            dispatch(addCustomField(fieldForm));
        }
        handleCloseDialog();
    };

    const handleRemoveField = (index: number) => {
        if (confirm('Are you sure you want to remove this field?')) {
            dispatch(removeCustomField(index));
        }
    };

    const handleMoveUp = (index: number) => {
        if (index > 0) {
            dispatch(reorderCustomField({ fromIndex: index, toIndex: index - 1 }));
        }
    };

    const handleMoveDown = (index: number) => {
        if (index < customFields.length - 1) {
            dispatch(reorderCustomField({ fromIndex: index, toIndex: index + 1 }));
        }
    };

    const showOptionsEditor = fieldForm.type === CustomFieldType.SELECT || 
                              fieldForm.type === CustomFieldType.MULTISELECT;

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Custom Fields Configuration</CardTitle>
                        <CardDescription>
                            Configure custom fields for contact management
                        </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="use-defaults">Use Default Fields</Label>
                        <Switch
                            id="use-defaults"
                            checked={useDefaultFields}
                            onCheckedChange={(checked) => dispatch(setUseDefaultFields(checked))}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {useDefaultFields ? (
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-4">
                        <p className="font-medium mb-2">Default fields will be created:</p>
                        <p>First Name, Middle Name, Last Name, Date of Birth, Gender, Religion, Email, Phone, Work Number, Home Number, Address, City, State/Province, Postal/Zip Code, Country, Company</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            {customFields.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No custom fields configured yet.</p>
                                    <p className="text-sm">Click "Add Field" to create your first custom field.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {customFields.map((field, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <FieldTypeIcon type={field.type} />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{field.name}</span>
                                                        {field.isRequired && (
                                                            <Badge variant="destructive" className="text-xs">Required</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Key: {field.fieldKey} • Type: {field.type}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMoveUp(index)}
                                                    disabled={index === 0}
                                                >
                                                    <ChevronUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMoveDown(index)}
                                                    disabled={index === customFields.length - 1}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenDialog(index)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveField(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" onClick={() => handleOpenDialog()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Field
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingIndex !== null ? 'Edit Custom Field' : 'Add Custom Field'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Configure the custom field properties
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Field Name *</Label>
                                            <Input
                                                id="name"
                                                value={fieldForm.name}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fieldKey">Field Key *</Label>
                                            <Input
                                                id="fieldKey"
                                                value={fieldForm.fieldKey}
                                                onChange={(e) => setFieldForm({ ...fieldForm, fieldKey: e.target.value })}
                                                placeholder="full_name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Field Type *</Label>
                                            <Select
                                                value={fieldForm.type}
                                                onValueChange={(value) => setFieldForm({ ...fieldForm, type: value as CustomFieldType })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(CustomFieldType).map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            <div className="flex items-center gap-2">
                                                                <FieldTypeIcon type={type} />
                                                                {type}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="defaultValue">Default Value</Label>
                                            <Input
                                                id="defaultValue"
                                                value={fieldForm.defaultValue}
                                                onChange={(e) => setFieldForm({ ...fieldForm, defaultValue: e.target.value })}
                                                placeholder="Optional default value"
                                            />
                                        </div>
                                    </div>

                                    {showOptionsEditor && (
                                        <OptionsEditor
                                            value={fieldForm.options || ''}
                                            onChange={(value) => setFieldForm({ ...fieldForm, options: value })}
                                        />
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="validationRegex">Validation Regex</Label>
                                        <Input
                                            id="validationRegex"
                                            value={fieldForm.validationRegex}
                                            onChange={(e) => setFieldForm({ ...fieldForm, validationRegex: e.target.value })}
                                            placeholder="^[a-zA-Z]+$"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="helpText">Help Text</Label>
                                        <Textarea
                                            id="helpText"
                                            value={fieldForm.helpText}
                                            onChange={(e) => setFieldForm({ ...fieldForm, helpText: e.target.value })}
                                            placeholder="Helpful description for users"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="isRequired"
                                            checked={fieldForm.isRequired}
                                            onCheckedChange={(checked) => setFieldForm({ ...fieldForm, isRequired: checked })}
                                        />
                                        <Label htmlFor="isRequired">Required Field</Label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                        Cancel
                                    </Button>
                                    <Button type="button" onClick={handleSaveField}>
                                        {editingIndex !== null ? 'Update Field' : 'Add Field'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
