import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { z } from "zod";
import { groqClient } from "../../config/aiConfig.js";
import { retrieve } from "./queryService.js";

export async function compute(query: string): Promise<string> {
  const retrieveTool = tool(async ({ query }) => retrieve(query), {
    name: "retrieve_documents",
    description:
      "Use this to search for relevant information from uploaded PDF documents to answer questions.",
    schema: z.object({
      query: z
        .string()
        .describe("The user's question to search for in the documents."),
    }),
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an assistant for answering questions based on PDF documents that have been uploaded.",
    ],
    ["placeholder", "{chat_history}"],
    ["human", "Answer the following question: {input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({
    llm: groqClient,
    tools: [retrieveTool],
    prompt,
  });
  const executor = new AgentExecutor({ agent, tools: [retrieveTool] });
  const result = await executor.invoke({ input: query })
  return result.output;

}
