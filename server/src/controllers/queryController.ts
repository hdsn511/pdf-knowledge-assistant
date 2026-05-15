import type { Request, Response } from "express";
import { groqClient } from "../config/aiConfig.js";
import { compute } from "../services/ai/agentService.js";
import { retrieve } from "../services/ai/queryService.js";

export const queryController = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const decision =
      await groqClient.invoke(`Is this query a simple document lookup
        or does it require complex reasoning like comparison or calculation?
        query: ${query}
        Answer with only SIMPLE or COMPLEX`);

    const text = decision.content as string;

    if (text.includes("SIMPLE")) {
      const answer = await retrieve(query);
      res.status(200).json({ answer });
    } else {
      const answer = await compute(query);
      res.status(200).json({ answer });
    }
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
};
