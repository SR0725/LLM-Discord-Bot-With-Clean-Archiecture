import { type ChatHistory } from "./chat-history";

export interface Account {
  accountId: string
  username: string
  usedModel: string
  prompt: string
  memoryLength: number
  currentMonthExpense: number
  maxMonthlyExpense: number
  chatHistories: ChatHistory[]
}
