export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface UploadedDoc {
  filename: string;
  filePath: string;
}