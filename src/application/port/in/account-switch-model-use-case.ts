import { type Account } from "@/application/domain/model/account";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";
import { DiscordAccount } from "./discord-account";

export interface AccountSwitchModelUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    saveAccount: SaveAccountPort
  ): AccountSwitchModelUseCase;
}

export interface AccountSwitchModelUseCase {
  (discordAccount: DiscordAccount, model: string): Promise<Account>;
}
