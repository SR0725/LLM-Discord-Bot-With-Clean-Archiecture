import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { type LoadAccountPort } from "@/application/port/out/load-account-port";
import { type SaveAccountPort } from "@/application/port/out/save-account-port";
import AccountPersistenceSaveAdapter from "@/adapter/out/persistence/account-persistence-save-adapter";
import AccountPersistenceLoadAdapter from "@/adapter/out/persistence/account-persistence-load-adapter";
import AccountSwitchModelServiceConstructor from "@/application/domain/service/account-switch-model-service";
import AccountSetPromptServiceConstructor from "@/application/domain/service/account-set-prompt-service";
import AccountNewChatThreadServiceConstructor from "@/application/domain/service/account-new-chat-thread-service";
import AccountChatServiceConstructor from "@/application/domain/service/account-chat-service";
import ChatAdapter from "@/adapter/out/llm/chat-adapter";

import SetupDiscordCommandHandlers from "@/adapter/in/discord/setup-discord-command-handlers";

// 初始化語言模型
const chatWithLLM = ChatAdapter;

// 初始化持久層
const loadAccount: LoadAccountPort = AccountPersistenceLoadAdapter;
const saveAccount: SaveAccountPort = AccountPersistenceSaveAdapter;

// 初始化服務
const accountSwitchModelUseCase: AccountSwitchModelUseCase =
  AccountSwitchModelServiceConstructor(loadAccount, saveAccount);
const accountSetPromptUseCase = AccountSetPromptServiceConstructor(
  loadAccount,
  saveAccount
);
const accountNewChatThreadUseCase = AccountNewChatThreadServiceConstructor(
  loadAccount,
  saveAccount
);
const accountChatUseCase = AccountChatServiceConstructor(
  loadAccount,
  saveAccount,
  chatWithLLM
);

// 初始化 Discord 指令處理器
const discordBotToken = process.env.DISCORD_BOT_TOKEN ?? "";
if (!discordBotToken) {
  throw new Error("Discord bot token is required!");
}
const discordBotClientId = process.env.DISCORD_BOT_CLIENT_ID ?? "";
if (!discordBotClientId) {
  throw new Error("Discord bot client id is required!");
}
const discordGuildId = process.env.DISCORD_GUILD_ID ?? "";
if (!discordGuildId) {
  throw new Error("Discord guild id is required!");
}

SetupDiscordCommandHandlers(
  discordBotToken,
  discordBotClientId,
  discordGuildId,
  {
    accountSwitchModelUseCase,
    accountSetPromptUseCase,
    accountNewChatThreadUseCase,
    accountChatUseCase,
  }
);
