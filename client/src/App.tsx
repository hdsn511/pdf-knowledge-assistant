import { useState } from "react";
import Sidebar from "./components/SideBar";
import { useApi } from "./hooks/useApi";
import type { Message, UploadedDoc } from "./types";
import ChatArea from './components/ChatArea';

export default function App() {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { uploadDocs, clearHistory, query } = useApi();

  async function handleFileUpload(files: FileList) {
    setUploading(true);
    try {
      const uploadedDocs = await uploadDocs(files);
      setDocs((prev) => [...prev, ...uploadedDocs]);
    } catch (err) {
      console.error(err);
      alert("Failed to upload files");
    } finally {
      setUploading(false);
    }
  }

  async function handleQuery(q: string) {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: q,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const answer = await query(q);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      alert("Failed to process query");
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    try {
      await clearHistory();
      setDocs([]);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="h-screen p-3 flex gap-3 bg-[#1a1412] font-sans">
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <Sidebar
          docs={docs}
          uploading={uploading}
          onUpload={handleFileUpload}
          onClearHistory={handleClearHistory}
        />
      </div>
      <div className="flex-1 rounded-2xl bg-[#221b17] panel-elevated overflow-hidden">
        <ChatArea
          messages={messages}
          loading={loading}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          onQuery={handleQuery}
        />
      </div>
    </div>
  );
}

