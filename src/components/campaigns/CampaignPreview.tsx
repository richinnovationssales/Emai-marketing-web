'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
  html: string;
  subject: string;
  onClose: () => void;
}

export function CampaignPreview({ html, subject, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Campaign Preview</h2>
            <p className="text-xs text-muted-foreground">Previewing the actual HTML output for recipients</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Browser Simulation Header */}
        <div className="bg-white px-10 py-5 border-b space-y-2">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-400 w-20">Subject:</span>
            <span className="text-sm font-medium text-gray-900">{subject || "(No Subject Provided)"}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-400 w-20">From:</span>
            <span className="text-sm text-gray-900 font-medium">
              BEE Smart <span className="text-gray-400 font-normal ml-1">&lt;marketing@yourcompany.com&gt;</span>
            </span>
          </div>
        </div>

        {/* Email Body Rendering */}
        <div className="flex-1 bg-gray-100 p-8 overflow-hidden">
          <div className="bg-white w-full h-full rounded shadow-sm overflow-hidden border">
            {/*
              previewHtml passed in is already the fully merged content
              (body on top + template below), built in CampaignForm.
              srcDoc renders it as a proper HTML document inside the iframe.
            */}
            <iframe
              title="Campaign HTML Content"
              srcDoc={html}
              className="w-full h-full border-none bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import { Button } from '@/components/ui/button';

// interface Props {
//   html: string;
//   customMessage: string;
//   onClose: () => void;
// }

// export function CampaignPreview({ html, customMessage, onClose }: Props) {
//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg w-full max-w-4xl p-6 space-y-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Campaign Preview</h2>
//           <Button variant="ghost" onClick={onClose}>
//             Close
//           </Button>
//         </div>

//         <div className="border rounded-md overflow-hidden">
//           <iframe
//             title="Campaign HTML"
//             srcDoc={html}
//             className="w-full h-[400px]"
//           />
//         </div>

//         <div className="border rounded-md p-4">
//           <div dangerouslySetInnerHTML={{ __html: customMessage }} />
//         </div>
//       </div>
//     </div>
//   );
// }
