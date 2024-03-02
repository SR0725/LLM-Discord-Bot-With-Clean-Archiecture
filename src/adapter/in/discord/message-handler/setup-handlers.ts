import AccountChatMessageHandlerConstructor from "./account-chat-message-handler";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import setupMessageActiveHandler from "./setup-message-service-handler";
import { Client } from "discord.js";

export interface ServiceList {
  accountChatUseCase: AccountChatUseCase;
}

function SetupDiscordMessageHandlers(
  client: Client,
  services: ServiceList
): void {
  const accountChatHandler = AccountChatMessageHandlerConstructor(
    services.accountChatUseCase
  );

  const handlers = [accountChatHandler];
  setupMessageActiveHandler(client, handlers);
}

export default SetupDiscordMessageHandlers;
