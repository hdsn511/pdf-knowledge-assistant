import type { MemoryVectorStore } from "langchain/vectorstores/memory";

let store: MemoryVectorStore | null = null;

export function getStore() {
  return store;
}

export function setStore(newStore: MemoryVectorStore) {
  store = newStore;
}

export function clearStore() {
  store = null;
}