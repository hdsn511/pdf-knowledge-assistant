import { useRef } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import type { UploadedDoc } from '../types/index';

interface SidebarProps {
  docs: UploadedDoc[];
  uploading: boolean;
  onUpload: (files: FileList) => void;
  onClearHistory: () => void;
}

export default function Sidebar({ docs, uploading, onUpload, onClearHistory }: SidebarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = ''; // reset input
    }
  }
  
  return (
    <div className="w-72 h-full rounded-2xl bg-[#221b17] panel-elevated flex flex-col">

      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#2e241e]">
        <span className="text-sm font-semibold text-[#eeeeee] font-sans">
          Documents
        </span>
        <span className="bg-[#3d3028] text-[#ffe0c2] rounded-full px-2 py-0.5 text-xs">{docs.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-[#2a211c] flex items-center justify-center">
              <FileText size={18} stroke="#a07e6a"/>
            </div>
            <p className="text-xs text-[#787878]">Upload PDFs to get started</p>
          </div>
        ) : (
          docs.map(doc => (
            <div
              key={doc.filePath}
              className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[#322821] transition-colors"
            >
              <FileText size={16} stroke="#a07e6a"/>
              <span className="text-sm text-[#eeeeee] truncate flex-1">{doc.filename}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="h-auto px-3 py-3 border-t border-[#2e241e] flex flex-col gap-2">
        <Button
          className="w-full h-9 rounded-lg bg-[#ffe0c2] text-[#1a1412] hover:bg-[#ffdfb5] text-sm font-medium"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-[#1a1412] border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            'Upload PDF'
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full h-9 rounded-lg text-xs text-[#787878] hover:text-[#ff6b6b] hover:bg-[#322821]"
          onClick={onClearHistory}
        >
          <Trash2 size={13} className="mr-1.5"></Trash2>
          Clear History
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
