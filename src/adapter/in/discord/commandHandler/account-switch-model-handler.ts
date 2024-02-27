import { type InterfaceCommandHandler } from "./interface-command-handler";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import z from "zod";

const AccountSwitchModelHandler: InterfaceCommandHandler<
  AccountSwitchModelUseCase
> = (switchAccountModel) => async (interaction) => {
  if (interaction.commandName !== "account-switch") {
    return;
  }

  try {
    const model = z.string().parse(interaction.options.getString("model"));
    const result = await switchAccountModel(interaction.user.id, model);

    await interaction.reply({
      content: `Switched model to ${result.usedModel}`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Failed to switch model",
      ephemeral: true,
    });
  }
};

export default AccountSwitchModelHandler;
