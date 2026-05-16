# PDF Knowledge Assistant

[Live Demo](https://pdf-knowledge-assistant-plum.vercel.app/)

## Overview
Upload one or more PDF documents and ask questions about them. The assistant retrieves relevant context from your documents and answers conversationally. Start a fresh session anytime with the clear history button.

## Features
- Multi-PDF upload and indexing
- Natural language Q&A over document contents
- Sidebar document manager
- Clear session / fresh chat

## Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui

**Backend**
- Node.js + Express + TypeScript
- LangChain (retrieval, agents, prompts)
- LlamaIndex PDF reader
- MemoryVectorStore + Gemini embeddings
- Groq (llama-3.1-8b-instant)

**Infrastructure**
- Vercel (frontend)
- Railway (backend)
