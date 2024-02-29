export interface ChatThread {
    threadId: string;
    accountId: string;
    useModel: string;
    prompt: string;
    memoryLength: number;
    chatHistories: ChatHistory[];
}

export enum Role {
    Bot = "Bot",
    User = "User",
}

export interface ChatHistory {
    id: string;
    threadId: string;
    role: Role;
    content: string;
    cost: number;
}
