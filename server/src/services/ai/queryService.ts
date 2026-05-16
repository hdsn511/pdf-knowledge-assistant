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
    Provide an answer to the users question, use context, if any.
    Elaborate on every detail you can respective to the goal for the user for a max
    of 8 sentences. But aim for 3-5 sentences. A user wants to know the important things,
    which commonly means, summaries, high-level overviews, and critical details.
    
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
