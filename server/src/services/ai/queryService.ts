import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { groqClient, googleEmbeddings } from "../../config/aiConfig.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function retrieve(query: string): Promise<string> {
  const documents = await FaissStore.load(
    '.faiss_db',
    googleEmbeddings
  );
  const retrievalResults = await documents.similaritySearch(query, 5);

  
  const prompt = ChatPromptTemplate.fromTemplate(`
    Given the following retreived documents as context, answer the question, 
    question: {question}
    context: {context}
    `);

  const chain= prompt.pipe(groqClient).pipe(new StringOutputParser());

  const answer = await chain.invoke({
    question: query,
    context: retrievalResults.map((doc) => doc.pageContent).join("\n"),
  });
  return answer;
}