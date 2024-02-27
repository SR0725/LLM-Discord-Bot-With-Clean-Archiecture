import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { type LoadAccountPort } from "@/application/port/out/load-account-port";
import { type SaveAccountPort } from "@/application/port/out/save-account-port";
import AccountPersistenceSaveAdapter from "@/adapter/out/persistence/account-persistence-save-adapter";
import AccountPersistenceLoadAdapter from "@/adapter/out/persistence/account-persistence-load-adapter";
import AccountSwitchModelServiceConstructor from "@/application/domain/service/account-switch-model-service";
import SetupDiscordCommandHandlers from "@/adapter/in/discord/setup-discord-command-handlers";

// 初始化持久層
const loadAccount: LoadAccountPort = AccountPersistenceLoadAdapter;
const saveAccount: SaveAccountPort = AccountPersistenceSaveAdapter;

// 初始化服務
const accountSwitchModelUseCase: AccountSwitchModelUseCase =
  AccountSwitchModelServiceConstructor(loadAccount, saveAccount);

// 初始化 Discord 指令處理器
const discordBotToken = process.env.DISCORD_BOT_TOKEN ?? "";
if (!discordBotToken) {
  throw new Error("Discord bot token is required!");
}
const discordBotClientId = process.env.DISCORD_BOT_CLIENT_ID ?? "";
if (!discordBotClientId) {
  throw new Error("Discord bot client id is required!");
}

SetupDiscordCommandHandlers(discordBotToken, discordBotClientId, {
  accountSwitchModelUseCase,
});
