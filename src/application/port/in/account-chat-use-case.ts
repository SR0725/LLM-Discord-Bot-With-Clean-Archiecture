import type { ChatLLMPort } from "../out/chat-llm-port";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";
import type { DiscordAccount } from "./discord-account";

export interface AccountChatUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    saveAccount: SaveAccountPort,
    chatWithLLM: ChatLLMPort
  ): AccountChatUseCase;
}

export interface AccountChatUseCase {
  (discordAccount: DiscordAccount, message: string): Promise<string>;
}