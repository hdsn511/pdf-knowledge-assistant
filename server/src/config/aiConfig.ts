import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
export const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
});

export const groqClient = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
});