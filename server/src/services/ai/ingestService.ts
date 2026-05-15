import { FaissStore } from "@langchain/community/vectorstores/faiss";
import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFReader } from "@llamaindex/readers/pdf";
import fs from "fs";
import type { Document as LlamaIndexDocument, Metadata } from "llamaindex";
import { googleEmbeddings } from "../../config/aiConfig.js";

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
  const dbPath = ".faiss_db";

  if (fs.existsSync(dbPath)) {
    const existingStore = await FaissStore.load(dbPath, googleEmbeddings);
    await existingStore.addDocuments(chunks);
    await existingStore.save(dbPath);
  } else {
    const newStore = await FaissStore.fromDocuments(chunks, googleEmbeddings);
    await newStore.save(dbPath);
  }
}

export async function ingest(filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    const text = await extractText(filePath);
    const chunks = await chunkText(text);
    await storeEmbeddings(chunks);
  }
}
