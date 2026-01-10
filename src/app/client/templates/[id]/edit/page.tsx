'use client';

import React, { useState } from 'react';
import { Save, Eye, Code, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-radius: 0 0 10px 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to Our Newsletter</h1>
  </div>
  
  <div class="content">
    <h2>Hello {{firstName}}!</h2>
    
    <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
    
    <p>Here's what you can expect from us:</p>
    <ul>
      <li>Weekly updates on industry trends</li>
      <li>Exclusive offers and promotions</li>
      <li>Tips and best practices</li>
    </ul>
    
    <center>
      <a href="{{callToActionUrl}}" class="button">Get Started</a>
    </center>
    
    <p>If you have any questions, feel free to reach out to our support team.</p>
    
    <p>Best regards,<br>The Team</p>
  </div>
  
  <div class="footer">
    <p>© 2026 Your Company. All rights reserved.</p>
    <p>{{unsubscribeLink}}</p>
  </div>
</body>
</html>`;

export default function TemplateEditor() {
  const [templateName, setTemplateName] = useState('New Template');
  const [htmlCode, setHtmlCode] = useState(DEFAULT_TEMPLATE);
  const [activeTab, setActiveTab] = useState('edit');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving template:', { name: templateName, html: htmlCode });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setHtmlCode(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadDefaultTemplate = () => {
    setHtmlCode(DEFAULT_TEMPLATE);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Template Editor</h2>
          <p className="text-muted-foreground">Create and edit email templates</p>
        </div>
        <div className="flex gap-2">
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".html,.htm"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Template saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Template Name */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Editor Tabs */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Editor</CardTitle>
            <Button variant="outline" size="sm" onClick={loadDefaultTemplate}>
              Load Default Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">
                <Code className="mr-2 h-4 w-4" />
                Edit HTML
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-4">
              <div className="space-y-4">
                <div className="rounded-md border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Available variables: <code className="bg-muted px-2 py-1 rounded">{'{{firstName}}'}</code>{' '}
                    <code className="bg-muted px-2 py-1 rounded">{'{{lastName}}'}</code>{' '}
                    <code className="bg-muted px-2 py-1 rounded">{'{{email}}'}</code>{' '}
                    <code className="bg-muted px-2 py-1 rounded">{'{{callToActionUrl}}'}</code>{' '}
                    <code className="bg-muted px-2 py-1 rounded">{'{{unsubscribeLink}}'}</code>
                  </p>
                </div>
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full h-[500px] font-mono text-sm p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  spellCheck={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-md p-4 bg-gray-50 min-h-[500px]">
                <div className="bg-white shadow-sm rounded-md max-w-2xl mx-auto">
                  <iframe
                    srcDoc={htmlCode.replace(/\{\{(\w+)\}\}/g, (_, key) => {
                      const mockData: Record<string, string> = {
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john.doe@example.com',
                        callToActionUrl: '#',
                        unsubscribeLink: 'Unsubscribe from this list'
                      };
                      return mockData[key] || `{{${key}}}`;
                    })}
                    className="w-full h-[500px] border-0"
                    title="Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Use inline CSS for better email client compatibility</p>
          <p>• Keep your template width at 600px for optimal viewing</p>
          <p>• Test your template across different email clients before sending</p>
          <p>• Use variables like {'{{firstName}}'} to personalize emails</p>
        </CardContent>
      </Card>
    </div>
  );
}
