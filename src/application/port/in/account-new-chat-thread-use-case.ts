import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";
import type { DiscordAccount } from "./discord-account";

export interface AccountNewChatThreadUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    saveAccount: SaveAccountPort
  ): AccountNewChatThreadUseCase;
}

export interface AccountNewChatThreadUseCase {
  (discordAccount: DiscordAccount): Promise<boolean>;
}