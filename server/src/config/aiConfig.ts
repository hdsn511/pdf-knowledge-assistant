import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
export const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
 
  model: "gemini-embedding-001",
});

export const groqClient = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0.1,
});