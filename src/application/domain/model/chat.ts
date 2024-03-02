export interface ChatThread {
  threadId: string;
  accountId: string;
  useModel: string;
  prompt: string;
  maxChatLength: number;
  chatHistories: ChatHistory[];
}

export enum Role {
  Bot = "Bot",
  User = "User",
}

export interface ChatHistory {
  id: string;
  timestamp: number;
  threadId: string;
  role: Role;
  content: string;
  cost: number;
  imagePaths?: {
    path: string;
    mimeType: "image/png" | "image/jpeg";
  }[];
}
