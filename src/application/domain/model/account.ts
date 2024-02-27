import { type ChatHistory } from "./chat-history";

export interface Account {
  accountId: string;
  username: string;
  usedModel: string;
  prompt: string;
  memoryLength: number;
  currentMonthExpense: number;
  maxMonthlyExpense: number;
  chatHistories: ChatHistory[];
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
  chatHistories: [],
});
