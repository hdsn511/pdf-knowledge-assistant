import type { Request, Response } from "express";
import fs from "fs";
import { ingest } from "../services/ai/ingestService.js";

export const uploadPdf = async (req: Request, res: Response) => {
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

export const deletePdf = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ error: "File path is required" });
    }
    const filePath = `./uploads/${filename}`;
    await fs.promises.unlink(filePath);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
