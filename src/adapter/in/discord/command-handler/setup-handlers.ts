import AccountSwitchModelCommandHandlerConstructor from "./account-switch-model-command-handler";
import AccountSetPromptCommandHandlerConstructor from "./account-set-prompt-command-handler";
import AccountNewChatCommandHandlerConstructor from "./account-new-chat-command-handler";
import AccountInfoCommandHandlerConstructor from "./account-info-command-handler";

import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { type AccountSetPromptUseCase } from "@/application/port/in/account-set-prompt-use-case";
import { type AccountNewChatThreadUseCase } from "@/application/port/in/account-new-chat-thread-use-case";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import type { AccountInfoUseCase } from "@/application/port/in/account-info-use-case";
import type { Client } from "discord.js";
import setupSlashCommand from "./setup-slash-command";
import setupCommandServiceHandler from "./setup-command-service-handler";

export interface ServiceList {
  accountSwitchModelUseCase: AccountSwitchModelUseCase;
  accountSetPromptUseCase: AccountSetPromptUseCase;
  accountNewChatThreadUseCase: AccountNewChatThreadUseCase;
  accountChatUseCase: AccountChatUseCase;
  accountInfoUseCase: AccountInfoUseCase;
}

function SetupDiscordCommandHandlers(
  client: Client,
  token: string,
  clientId: string,
  guildId: string,
  services: ServiceList
): void {
  const accountSwitchModelHandler = AccountSwitchModelCommandHandlerConstructor(
    services.accountSwitchModelUseCase
  );
  const accountSetPromptHandler = AccountSetPromptCommandHandlerConstructor(
    services.accountSetPromptUseCase
  );

  const accountNewChatHandler = AccountNewChatCommandHandlerConstructor([
    services.accountNewChatThreadUseCase,
    services.accountChatUseCase,
  ]);

  const accountInfoHandler = AccountInfoCommandHandlerConstructor(
    services.accountInfoUseCase
  );

  const handlers = [
    accountSwitchModelHandler,
    accountSetPromptHandler,
    accountNewChatHandler,
    accountInfoHandler,
  ];
  setupSlashCommand(token, clientId, guildId, handlers);
  setupCommandServiceHandler(client, handlers);
}

export default SetupDiscordCommandHandlers;