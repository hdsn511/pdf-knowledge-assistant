import { Router } from "express"
import { uploadPdf, clearHistory } from "../controllers/pdfController.js";
import { upload } from "../config/multerConfig.js";

const pdfRouter = Router()

pdfRouter.post("/upload", upload.array('pdf'),  uploadPdf);
pdfRouter.post("/reset", clearHistory);

export default pdfRouter;