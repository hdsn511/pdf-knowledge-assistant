import { Router } from "express";
import { queryController } from "../controllers/queryController.js";

const queryRouter = Router();

queryRouter.post("/", queryController);

export default queryRouter;