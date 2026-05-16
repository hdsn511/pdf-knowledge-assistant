import type { Request, Response } from "express";
import fs from "fs";
import { ingest } from "../services/ai/ingestService.js";
import { clearStore } from "../services/ai/vectorStore.js";

export const uploadPdf = async (req: Request, res: Response) => {
  console.log("Upload hit, files:", req.files);
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const filePaths = files.map((file) => file.path);
    await ingest(filePaths);

    res.status(200).json({ message: "Files uploaded successfully", filePaths });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

export const clearHistory = async (req: Request, res: Response) => {
  try {
    clearStore();
    await fs.promises.rm('./uploads', { recursive: true, force: true });
    await fs.promises.mkdir('./uploads');
    res.status(200).json({ message: "History cleared" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
};
