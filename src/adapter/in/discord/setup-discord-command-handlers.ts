import { Client, REST, Routes, GatewayIntentBits } from "discord.js";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import AccountSwitchModelHandlerConstructor from "./account-switch-model-handler";
import pipe from "@/common/pipe";
import { InterfaceCommandHandler } from "@/application/port/in/interface-command-handler";

function SetupDiscordCommandHandlers(
  token: string,
  clientId: string,
  services: {
    accountSwitchModelUseCase: AccountSwitchModelUseCase;
  }
): void {
  const accountSwitchModelHandler = AccountSwitchModelHandlerConstructor(
    services.accountSwitchModelUseCase
  );

  const handlers = [accountSwitchModelHandler];
  console.log(handlers);
  setupSlashCommand(token, clientId, handlers);
  setupHandler(token, handlers);
}

function setupSlashCommand(
  token: string,
  clientId: string,
  handlers: InterfaceCommandHandler<any>[]
) {
  const rest = new REST({ version: "10" }).setToken(token);

  rest.put(Routes.applicationCommands(clientId), {
    body: handlers.map((h) => h.slashCommand),
  });
}

function setupHandler(token: string, handlers: InterfaceCommandHandler<any>[]) {
  const handleCommand = pipe(...handlers.map((h) => h.handle));
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.login(token);
  client.once("ready", () => {
    console.log("Discord bot is ready!");
  });
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    handleCommand(interaction);
  });
}

export default SetupDiscordCommandHandlers;
