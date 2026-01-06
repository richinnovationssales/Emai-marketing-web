'use client';

import { Button } from '@/components/ui/button';

interface Props {
  html: string;
  customMessage: string;
  onClose: () => void;
}

export function CampaignPreview({ html, customMessage, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Campaign Preview</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <iframe
            title="Campaign HTML"
            srcDoc={html}
            className="w-full h-[400px]"
          />
        </div>

        <div className="border rounded-md p-4">
          <div dangerouslySetInnerHTML={{ __html: customMessage }} />
        </div>
      </div>
    </div>
  );
}
