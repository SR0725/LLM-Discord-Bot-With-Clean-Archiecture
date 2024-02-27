import { type Client } from "discord.js";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import AccountSwitchModelHandler from "./commandHandler/account-switch-model-handler";

function setupDiscordCommandHandlers(
  client: Client,
  accountSwitchModelUseCase: AccountSwitchModelUseCase
): void {
  const handleAccountSwitchModel = AccountSwitchModelHandler(
    accountSwitchModelUseCase
  );

  const handlers = {
    "account-switch": handleAccountSwitchModel,
  };

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    if (!Object.keys(handlers).includes(commandName)) {
      return;
    }

    const handle = handlers[commandName as keyof typeof handlers];
    if (handle) {
      await handle(interaction);
    }
  });
}

export default setupDiscordCommandHandlers;
