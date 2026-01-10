'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Code, Download, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Split from 'react-split';

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 40px 30px;
      border: 1px solid #dddddd;
      border-top: none;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 25px 0;
    }
    .footer {
      background: #f8f8f8;
      padding: 25px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-radius: 0 0 8px 8px;
      border: 1px solid #dddddd;
      border-top: none;
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
      <a href="{{callToActionUrl}}" class="button">Get Started Now</a>
    </center>
    
    <p>If you have any questions, feel free to reach out to our support team.</p>
    
    <p>Best regards,<br>The Team</p>
  </div>
  
  <div class="footer">
    <p>© 2026 Your Company. All rights reserved.</p>
    <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="#">Update Preferences</a></p>
  </div>
</body>
</html>`;

export default function TemplateEditorPage() {
  const [templateName, setTemplateName] = useState('New Template');
  const [htmlCode, setHtmlCode] = useState(DEFAULT_TEMPLATE);
  const [viewMode, setViewMode] = useState<'code' | 'preview' | 'split'>('split');
  const [saved, setSaved] = useState(false);

  // Try to load last used split sizes
  const [sizes, setSizes] = useState([50, 50]);

  useEffect(() => {
    const savedSizes = localStorage.getItem('editor-split-sizes');
    if (savedSizes) {
      try {
        setSizes(JSON.parse(savedSizes));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    console.log('Saving template:', { name: templateName, html: htmlCode });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setHtmlCode(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '-').toLowerCase() || 'template'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadDefaultTemplate = () => {
    setHtmlCode(DEFAULT_TEMPLATE);
  };

  const getPreviewHtml = () => {
    return htmlCode.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const mock: Record<string, string> = {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.w@example.com',
        callToActionUrl: '#',
        unsubscribeLink: 'Unsubscribe from this list'
      };
      return mock[key] || `{{${key}}}`;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f11] text-gray-100 overflow-hidden">
      {/* Top Toolbar */}
      <div className="border-b border-gray-800 bg-[#161618] px-4 py-2.5 flex items-center justify-between gap-4 text-sm shrink-0">
        <div className="flex items-center gap-3">
          <Label htmlFor="template-name" className="font-medium whitespace-nowrap">
            Template:
          </Label>
          <Input
            id="template-name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-72 h-8 bg-[#1e1e20] border-gray-700 text-sm focus-visible:ring-purple-600"
            placeholder="Enter template name"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadDefaultTemplate}
            className="h-8 px-2.5 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Default
          </Button>

          <label htmlFor="file-upload">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-gray-300 hover:text-white hover:bg-gray-800"
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-1.5" />
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

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 px-2.5 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className={`h-8 px-3.5 ${saved ? 'bg-green-700 hover:bg-green-800' : 'bg-purple-700 hover:bg-purple-800'}`}
          >
            <Save className="h-4 w-4 mr-1.5" />
            {saved ? 'Saved!' : 'Save'}
          </Button>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="border-b border-gray-800 bg-[#121214] px-4 py-2 flex justify-center gap-2 shrink-0">
        <Button
          variant={viewMode === 'code' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('code')}
          className="h-8 data-[state=active]:bg-gray-700"
        >
          <Code className="h-4 w-4 mr-1.5" />
          Source
        </Button>

        <Button
          variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('preview')}
          className="h-8 data-[state=active]:bg-gray-700"
        >
          <Eye className="h-4 w-4 mr-1.5" />
          Preview
        </Button>

        <Button
          variant={viewMode === 'split' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('split')}
          className="h-8 data-[state=active]:bg-gray-700"
        >
          Split View
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'code' && (
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="w-full h-full font-mono text-sm p-5 bg-[#0d0d0f] text-gray-200 resize-none focus:outline-none caret-purple-500 selection:bg-purple-900/40"
            spellCheck={false}
          />
        )}

        {viewMode === 'preview' && (
          <div className="h-full bg-[#111113] p-6 overflow-auto flex items-start justify-center">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-[620px]">
              <iframe
                srcDoc={getPreviewHtml()}
                className="w-full min-h-[800px] border-0"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}

        {viewMode === 'split' && (
          <Split
            className="flex h-full"
            sizes={sizes}
            minSize={340}
            expandToMin={false}
            dragInterval={1}
            cursor="col-resize"
            onDragEnd={(newSizes) => {
              setSizes(newSizes);
              localStorage.setItem('editor-split-sizes', JSON.stringify(newSizes));
            }}
          >
            <div className="overflow-hidden bg-[#0d0d0f]">
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-full font-mono text-sm p-5 bg-[#0d0d0f] text-gray-200 resize-none focus:outline-none caret-purple-500 selection:bg-purple-900/40"
                spellCheck={false}
              />
            </div>

            <div className="overflow-auto bg-[#111113] p-6">
              <div className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto max-w-[620px]">
                <iframe
                  srcDoc={getPreviewHtml()}
                  className="w-full min-h-[800px] border-0"
                  title="Email Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </Split>
        )}
      </div>
    </div>
  );
}
// 'use client';

// import React, { useState } from 'react';
// import { Save, Eye, Code, Download, Upload } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// const DEFAULT_TEMPLATE = `<!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Email Template</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       line-height: 1.6;
//       color: #333;
//       max-width: 600px;
//       margin: 0 auto;
//       padding: 20px;
//     }
//     .header {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//       padding: 30px;
//       text-align: center;
//       border-radius: 10px 10px 0 0;
//     }
//     .content {
//       background: #ffffff;
//       padding: 30px;
//       border-left: 1px solid #e0e0e0;
//       border-right: 1px solid #e0e0e0;
//     }
//     .button {
//       display: inline-block;
//       background: #667eea;
//       color: white;
//       padding: 12px 30px;
//       text-decoration: none;
//       border-radius: 5px;
//       margin: 20px 0;
//     }
//     .footer {
//       background: #f5f5f5;
//       padding: 20px;
//       text-align: center;
//       font-size: 12px;
//       color: #666;
//       border-radius: 0 0 10px 10px;
//     }
//   </style>
// </head>
// <body>
//   <div class="header">
//     <h1>Welcome to Our Newsletter</h1>
//   </div>
  
//   <div class="content">
//     <h2>Hello {{firstName}}!</h2>
    
//     <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
    
//     <p>Here's what you can expect from us:</p>
//     <ul>
//       <li>Weekly updates on industry trends</li>
//       <li>Exclusive offers and promotions</li>
//       <li>Tips and best practices</li>
//     </ul>
    
//     <center>
//       <a href="{{callToActionUrl}}" class="button">Get Started</a>
//     </center>
    
//     <p>If you have any questions, feel free to reach out to our support team.</p>
    
//     <p>Best regards,<br>The Team</p>
//   </div>
  
//   <div class="footer">
//     <p>© 2026 Your Company. All rights reserved.</p>
//     <p>{{unsubscribeLink}}</p>
//   </div>
// </body>
// </html>`;

// export default function TemplateEditorPage() {
//   const [templateName, setTemplateName] = useState('New Template');
//   const [htmlCode, setHtmlCode] = useState(DEFAULT_TEMPLATE);
//   const [activeTab, setActiveTab] = useState('edit');
//   const [saved, setSaved] = useState(false);

//   const handleSave = () => {
//     // Implement save logic here
//     console.log('Saving template:', { name: templateName, html: htmlCode });
//     setSaved(true);
//     setTimeout(() => setSaved(false), 3000);
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const content = event.target?.result as string;
//         setHtmlCode(content);
//       };
//       reader.readAsText(file);
//     }
//   };

//   const handleDownload = () => {
//     const blob = new Blob([htmlCode], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${templateName.replace(/\s+/g, '-').toLowerCase()}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const loadDefaultTemplate = () => {
//     setHtmlCode(DEFAULT_TEMPLATE);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="space-y-1">
//           <h2 className="text-3xl font-bold tracking-tight">Template Editor</h2>
//           <p className="text-muted-foreground">Create and edit email templates</p>
//         </div>
//         <div className="flex gap-2">
//           <label htmlFor="file-upload">
//             <Button variant="outline" size="sm" asChild>
//               <span>
//                 <Upload className="mr-2 h-4 w-4" />
//                 Upload
//               </span>
//             </Button>
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             accept=".html,.htm"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//           <Button variant="outline" size="sm" onClick={handleDownload}>
//             <Download className="mr-2 h-4 w-4" />
//             Download
//           </Button>
//           <Button size="sm" onClick={handleSave}>
//             <Save className="mr-2 h-4 w-4" />
//             Save Template
//           </Button>
//         </div>
//       </div>

//       {saved && (
//         <Alert className="bg-green-50 border-green-200">
//           <AlertDescription className="text-green-800">
//             Template saved successfully!
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Template Name */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="space-y-2">
//             <Label htmlFor="template-name">Template Name</Label>
//             <Input
//               id="template-name"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//               placeholder="Enter template name"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Editor Tabs */}
//       <Card className="min-h-[600px]">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Editor</CardTitle>
//             <Button variant="outline" size="sm" onClick={loadDefaultTemplate}>
//               Load Default Template
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="edit">
//                 <Code className="mr-2 h-4 w-4" />
//                 Edit HTML
//               </TabsTrigger>
//               <TabsTrigger value="preview">
//                 <Eye className="mr-2 h-4 w-4" />
//                 Preview
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="edit" className="mt-4">
//               <div className="space-y-4">
//                 <div className="rounded-md border bg-muted/30 p-4">
//                   <p className="text-sm text-muted-foreground mb-2">
//                     Available variables: <code className="bg-muted px-2 py-1 rounded">{'{{firstName}}'}</code>{' '}
//                     <code className="bg-muted px-2 py-1 rounded">{'{{lastName}}'}</code>{' '}
//                     <code className="bg-muted px-2 py-1 rounded">{'{{email}}'}</code>{' '}
//                     <code className="bg-muted px-2 py-1 rounded">{'{{callToActionUrl}}'}</code>{' '}
//                     <code className="bg-muted px-2 py-1 rounded">{'{{unsubscribeLink}}'}</code>
//                   </p>
//                 </div>
//                 <textarea
//                   value={htmlCode}
//                   onChange={(e) => setHtmlCode(e.target.value)}
//                   className="w-full h-[500px] font-mono text-sm p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
//                   spellCheck={false}
//                 />
//               </div>
//             </TabsContent>

//             <TabsContent value="preview" className="mt-4">
//               <div className="border rounded-md p-4 bg-gray-50 min-h-[500px]">
//                 <div className="bg-white shadow-sm rounded-md max-w-2xl mx-auto">
//                   <iframe
//                     srcDoc={htmlCode.replace(/\{\{(\w+)\}\}/g, (_, key) => {
//                       const mockData: Record<string, string> = {
//                         firstName: 'John',
//                         lastName: 'Doe',
//                         email: 'john.doe@example.com',
//                         callToActionUrl: '#',
//                         unsubscribeLink: 'Unsubscribe from this list'
//                       };
//                       return mockData[key] || `{{${key}}}`;
//                     })}
//                     className="w-full h-[500px] border-0"
//                     title="Email Preview"
//                     sandbox="allow-same-origin"
//                   />
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       {/* Quick Tips */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base">Quick Tips</CardTitle>
//         </CardHeader>
//         <CardContent className="text-sm text-muted-foreground space-y-2">
//           <p>• Use inline CSS for better email client compatibility</p>
//           <p>• Keep your template width at 600px for optimal viewing</p>
//           <p>• Test your template across different email clients before sending</p>
//           <p>• Use variables like {'{{firstName}}'} to personalize emails</p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
