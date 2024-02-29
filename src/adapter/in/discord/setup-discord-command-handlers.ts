import { Client, REST, Routes, GatewayIntentBits } from "discord.js";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { type AccountSetPromptUseCase } from "@/application/port/in/account-set-prompt-use-case";
import AccountSwitchModelHandlerConstructor from "./account-switch-model-handler";
import AccountSetPromptHandlerConstructor from "./account-set-prompt-handler";
import type { InterfaceCommandHandler } from "@/application/port/in/interface-command-handler";

function SetupDiscordCommandHandlers(
  token: string,
  clientId: string,
  guildId: string,
  services: {
    accountSwitchModelUseCase: AccountSwitchModelUseCase;
    accountSetPromptUseCase: AccountSetPromptUseCase;
  }
): void {
  const accountSwitchModelHandler = AccountSwitchModelHandlerConstructor(
    services.accountSwitchModelUseCase
  );
  const accountSetPromptHandler = AccountSetPromptHandlerConstructor(
    services.accountSetPromptUseCase
  );

  const handlers = [accountSwitchModelHandler, accountSetPromptHandler];
  setupSlashCommand(token, clientId, guildId, handlers);
  setupHandler(token, handlers);
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

  console.log("Successfully registered commands:".concat(handlers.map((h) => h.slashCommand.name).join(", ")));

} catch (error) {
  console.error(error);
}
}

function setupHandler(token: string, handlers: InterfaceCommandHandler[]) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.login(token);
  client.once("ready", () => {
    console.log("Discord bot is ready!");
  });
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    handlers.forEach((h) => h.handle(interaction));
  });
}

export default SetupDiscordCommandHandlers;
