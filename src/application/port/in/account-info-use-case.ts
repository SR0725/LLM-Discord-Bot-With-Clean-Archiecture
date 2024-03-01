import { type InfoEmbed } from "../out/info-embed";
import { type LoadAccountPort } from "../out/load-account-port";
import { type DiscordAccount } from "./discord-account";

export interface AccountInfoUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
  ): AccountInfoUseCase;
}

export interface AccountInfoUseCase {
  (discordAccount: DiscordAccount): Promise<InfoEmbed>;
}