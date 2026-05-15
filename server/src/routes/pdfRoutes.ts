import { Router } from "express"
import { uploadPdf, deletePdf } from "../controllers/pdfController.js";
import { upload } from "../config/multerConfig.js";

const pdfRouter = Router()

pdfRouter.post("/upload", upload.array('pdf'),  uploadPdf);
pdfRouter.delete("/delete/:filename", deletePdf);

export default pdfRouter;