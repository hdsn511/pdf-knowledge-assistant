import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFReader } from "@llamaindex/readers/pdf";
import fs from "fs";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import type { Document as LlamaIndexDocument, Metadata } from "llamaindex";
import { googleEmbeddings } from "../../config/aiConfig.js";
import { getStore, setStore } from "./vectorStore.js";

async function extractText(
  filePath: string,
): Promise<LlamaIndexDocument<Metadata>[]> {
  const reader = new PDFReader();
  const data = await fs.promises.readFile(filePath);
  const text = await reader.loadDataAsContent(data);
  return text;
}

async function chunkText(
  text: LlamaIndexDocument<Metadata>[],
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.createDocuments(text.map((doc) => doc.text));
  return chunks;
}

async function storeEmbeddings(chunks: Document[]): Promise<void> {
  const existing = getStore();
  if (existing) {
    await existing.addDocuments(chunks);
  } else {
    const newStore = await MemoryVectorStore.fromDocuments(
      chunks,
      googleEmbeddings,
    );
    setStore(newStore);
  }
}

export async function ingest(filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    const text = await extractText(filePath);
    const chunks = await chunkText(text);
    await storeEmbeddings(chunks);
  }
}
