import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { groqClient } from "../../config/aiConfig.js";
import { getStore } from "./vectorStore.js";

export async function retrieve(query: string): Promise<string> {
  const store = getStore();
  if (!store) {
    return "Please upload a PDF document before asking questions.";
  }
  const retrievalResults = await store.similaritySearch(query, 3);

  const prompt = ChatPromptTemplate.fromTemplate(`
    You are a sharp, direct assistant. Answer concisely using only the provided context.
    No lists unless the question asks for them. No preamble. Just answer.
    If the context is irrelevant, say "I don't see that in the document."

    Question: {question}
    Context: {context}
  `);

  const chain = prompt.pipe(groqClient).pipe(new StringOutputParser());

  const answer = await chain.invoke({
    question: query,
    context: retrievalResults.map((doc) => doc.pageContent).join("\n"),
  });
  return answer;
}
