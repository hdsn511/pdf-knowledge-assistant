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
    You are a helpful assistant. Answer the user's question conversationally but without filler words.
    using context if any. Be concise and clear. If the context doesn't contain relevant info, 
    just say so briefly. Act confident in your response, but don't tell what you don't know.

  
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
