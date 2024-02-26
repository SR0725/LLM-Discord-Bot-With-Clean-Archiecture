import { Client } from "discord.js";
import { AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { AccountSwitchModelHandler } from "./commandHandler/account-switch-model-handler";

function setupDiscordCommandHandlers(
  client: Client,
  accountSwitchModelUseCase: AccountSwitchModelUseCase
): void {
  const accountSwitchModelHandler = new AccountSwitchModelHandler(
    accountSwitchModelUseCase
  );

  const handlers = {
    "account-switch": accountSwitchModelHandler,
  };

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    if (!Object.keys(handlers).includes(commandName)) {
      return;
    }

    const handler = handlers[commandName as keyof typeof handlers];
    if (handler) {
      await handler.handle(interaction);
    }
  });
}

export default setupDiscordCommandHandlers;
