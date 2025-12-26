'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, UploadCloud, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { AppDispatch } from '@/store';
import { bulkUploadContacts, fetchCustomFields, selectCustomFieldConfig, selectIsUploading, selectUploadResult, selectContactError, resetUploadResult, clearContactError } from '@/store/slices/contact.slice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { groupService } from '@/lib/api/services/group.service';
import { Group } from '@/types/entities/group.types';

export function BulkUpload() {
    const dispatch = useDispatch<AppDispatch>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [groups, setGroups] = useState<Group[]>([]);
    
    // Redux State
    const customFields = useSelector(selectCustomFieldConfig);
    const isUploading = useSelector(selectIsUploading);
    const result = useSelector(selectUploadResult);
    const error = useSelector(selectContactError);

    useEffect(() => {
        // Fetch custom fields for "Expected Headers" reference
        if (customFields.length === 0) {
            dispatch(fetchCustomFields({ includeInactive: false }));
        }
        // Fetch groups for dropdown
        groupService.getAll().then(setGroups).catch(console.error);

        // Cleanup
        return () => { dispatch(resetUploadResult()); dispatch(clearContactError()); }
    }, [dispatch, customFields.length]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
            setSelectedFile(file);
            dispatch(resetUploadResult());
            dispatch(clearContactError());
        } else {
            alert('Please select a valid CSV or Excel file.');
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        dispatch(bulkUploadContacts({ 
            file: selectedFile, 
            groupId: selectedGroupId || undefined 
        }));
    };

    const requiredHeaders = ['email', 'firstName', 'lastName', ...customFields.filter(f => f.isRequired).map(f => f.fieldKey)];
    const optionalHeaders = customFields.filter(f => !f.isRequired).map(f => f.fieldKey);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50">
            <Card className="border-muted/40 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Bulk Upload Contacts</CardTitle>
                    <CardDescription>Upload a CSV file to import multiple contacts at once.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    {/* Header Reference Panel */}
                    <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
                        <p className="font-semibold text-foreground">Expected CSV Headers:</p>
                        <div className="flex flex-wrap gap-2">
                            {requiredHeaders.map(h => (
                                <span key={h} className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded font-mono text-xs">
                                    {h}*
                                </span>
                            ))}
                            {optionalHeaders.map(h => (
                                <span key={h} className="px-2 py-1 bg-secondary text-secondary-foreground border rounded font-mono text-xs">
                                    {h}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Group Selection */}
                    <div className="max-w-xs">
                        <label className="text-sm font-medium mb-1 block">Assign to Group (Optional)</label>
                        <Select onValueChange={setSelectedGroupId} value={selectedGroupId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a group..." />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map(g => (
                                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dropzone */}
                    <div 
                        className={`
                            border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                            ${dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}
                            ${selectedFile ? 'bg-green-50/50 border-green-200' : ''}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept=".csv,.xlsx" 
                            className="hidden" 
                            onChange={handleChange} 
                        />
                        
                        {selectedFile ? (
                            <div className="text-center space-y-2 animate-in zoom-in-50">
                                <FileSpreadsheet className="w-12 h-12 text-green-500 mx-auto" />
                                <p className="font-medium text-lg">{selectedFile.name}</p>
                                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>Remove</Button>
                            </div>
                        ) : (
                            <div className="text-center space-y-3 pointer-events-none">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-lg font-medium text-foreground">Drag & drop your file here</p>
                                <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <Button 
                            size="lg" 
                            onClick={handleUpload} 
                            disabled={!selectedFile || isUploading}
                            className="min-w-[150px]"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : 'Start Import'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results / Errors */}
            {error && (
                <Alert variant="destructive" className="animate-in slide-in-from-bottom-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Upload Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {result && (
                <Card className="border-green-200 bg-green-50/10 animate-in slide-in-from-bottom-5">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="h-6 w-6" />
                            <CardTitle>Import Complete</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-foreground">{result.message}</p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-green-100 p-3 rounded text-center">
                                <div className="text-2xl font-bold text-green-700">{result.success}</div>
                                <div className="text-xs text-green-800 uppercase font-semibold">Successful</div>
                            </div>
                            <div className="bg-red-100 p-3 rounded text-center">
                                <div className="text-2xl font-bold text-red-700">{result.failed}</div>
                                <div className="text-xs text-red-800 uppercase font-semibold">Failed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
