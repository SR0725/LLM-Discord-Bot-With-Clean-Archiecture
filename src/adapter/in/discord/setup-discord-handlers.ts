import { Client } from "discord.js";
import { REST, Routes, GatewayIntentBits } from "discord.js";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { type AccountSetPromptUseCase } from "@/application/port/in/account-set-prompt-use-case";
import { type AccountNewChatThreadUseCase } from "@/application/port/in/account-new-chat-thread-use-case";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import AccountSwitchModelCommandHandlerConstructor from "./account-switch-model-command-handler";
import AccountSetPromptCommandHandlerConstructor from "./account-set-prompt-command-handler";
import AccountNewChatCommandHandlerConstructor from "./account-new-chat-command-handler";
import AccountChatMessageHandlerConstructor from "./account-chat-message-handler";
import type { InterfaceCommandHandler } from "@/application/port/in/interface-command-handler";
import type { InterfaceMessageHandler } from "@/application/port/in/interface-message-handler";

interface ServiceList {
  accountSwitchModelUseCase: AccountSwitchModelUseCase;
  accountSetPromptUseCase: AccountSetPromptUseCase;
  accountNewChatThreadUseCase: AccountNewChatThreadUseCase;
  accountChatUseCase: AccountChatUseCase;
}

function SetupDiscordHandlers(
  token: string,
  clientId: string,
  guildId: string,
  services: ServiceList
): void {
  const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]
  });
  client.login(token);
  client.once("ready", () => {
    console.log("Discord bot is ready!");
  });

  SetupDiscordCommandHandlers(client, token, clientId, guildId, services);
  SetupDiscordMessageHandlers(client, services);
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

  const handlers = [
    accountSwitchModelHandler,
    accountSetPromptHandler,
    accountNewChatHandler,
  ];
  setupSlashCommand(token, clientId, guildId, handlers);
  setupCommandActiveHandler(client, handlers);
}

function SetupDiscordMessageHandlers(
  client: Client,
  services: ServiceList
): void {
  const accountChatHandler = AccountChatMessageHandlerConstructor(
    services.accountChatUseCase
  );

  const handlers = [
    accountChatHandler,
  ];
  setupMessageActiveHandler(client, handlers);
}

async function setupSlashCommand(
  token: string,
  clientId: string,
  guildId: string,
  handlers: InterfaceCommandHandler[]
) {
  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: handlers.map((h) => h.slashCommand),
    });

    console.log(
      "Successfully registered commands:".concat(
        handlers.map((h) => h.slashCommand.name).join(", ")
      )
    );
  } catch (error) {
    console.error(error);
  }
}

function setupCommandActiveHandler(client: Client, handlers: InterfaceCommandHandler[]) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    handlers.forEach((h) => h.handle(interaction));
  });
}

function setupMessageActiveHandler(client: Client, handlers: InterfaceMessageHandler[]) {
  client.on("messageCreate", async (message) => {

    if (message.content.startsWith(":")) {
      handlers.forEach((h) => h.handle(message));
    }
  });
}

export default SetupDiscordHandlers;
