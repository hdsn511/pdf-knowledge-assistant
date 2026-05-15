import type { UploadedDoc } from "../types/index";


const BASE_URL = 'http://localhost:8000/api'

export function useApi() {
  async function uploadDocs(files: FileList): Promise<UploadedDoc[]> {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('pdf', file));
    
    const res = await fetch(`${BASE_URL}/pdf/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload files');
    }
    const data = await res.json();
    return data.filePaths.map((filePath: string) => ({
      filename: filePath.split('/').pop() ?? filePath,
      filePath,
    }));
  }

  async function clearHistory() {
    const res = await fetch(`${BASE_URL}/pdf/reset`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Failed to clear history');
    } 
  }

  async function query(q: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: q }),
    });

    if (!res.ok) {
      throw new Error('Failed to process query');
    }
    const data = await res.json();
    return data.answer;
  }

  return { uploadDocs, clearHistory, query };
}
