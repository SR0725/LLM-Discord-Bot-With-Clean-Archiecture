import { type Account } from "@/application/domain/model/account";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";
import type { DiscordAccount } from "./discord-account";

export interface AccountSetPromptUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    saveAccount: SaveAccountPort
  ): AccountSetPromptUseCase;
}

export interface AccountSetPromptUseCase {
  (discordAccount: DiscordAccount, prompt: string): Promise<Account>;
}
