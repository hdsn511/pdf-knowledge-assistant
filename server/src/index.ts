import cors from "cors";
import express from "express";
import fs from "fs";
import { errorHandler } from "./middleware/errorHandler.js";
import pdfRouter from "./routes/pdfRoutes.js";
import queryRouter from "./routes/queryRoutes.js";

fs.mkdirSync("./uploads", { recursive: true });

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pdf-knowledge-assistant-plum.vercel.app",
    ],
  }),
);
app.use(express.json());

app.use("/api/query", queryRouter);
app.use("/api/pdf", pdfRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
