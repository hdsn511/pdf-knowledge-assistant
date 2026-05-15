import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "./env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import pdfRouter from "./routes/pdfRoutes.js";
import queryRouter from "./routes/queryRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/query", queryRouter);
app.use("/api/pdf", pdfRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
