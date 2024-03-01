import { type ChatThread } from "./chat";
import { LLMModel } from "../../port/in/llm-model";

export interface Account {
  // discord user id
  accountId: string;
  // discord username
  username: string;
  // 選擇的語言模型
  usedModel: string;
  // 語言模型的 prompt
  prompt: string;
  // 每次對話的最大對談長度
  maxChatLength: number;
  // 剩餘可用對談點數，價格為 1 美元 1000 對談點數
  remainingChatPoints: number;
  currentThreadId: string | null;
  chatThreads: ChatThread[];
}

export const createEmptyAccount = (
  accountId: string,
  username: string
): Account => ({
  accountId,
  username,
  usedModel: LLMModel.GEMINI_PRO,
  prompt: "",
  maxChatLength: 20,
  remainingChatPoints: 1000,
  chatThreads: [],
  currentThreadId: null,
});
