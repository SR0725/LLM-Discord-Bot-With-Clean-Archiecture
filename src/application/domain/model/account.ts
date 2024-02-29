import { type ChatThread } from "./chat-history";

export interface Account {
  accountId: string;
  username: string;
  usedModel: string;
  prompt: string;
  memoryLength: number;
  currentMonthExpense: number;
  maxMonthlyExpense: number;
  currentThreadId: string | null;
  chatThreads: ChatThread[];
}

export const createEmptyAccount = (
  accountId: string,
  username: string
): Account => ({
  accountId,
  username,
  usedModel: "",
  prompt: "",
  memoryLength: 20,
  currentMonthExpense: 0,
  maxMonthlyExpense: 0,
  chatThreads: [],
  currentThreadId: null,
});
