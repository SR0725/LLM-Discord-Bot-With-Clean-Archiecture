import { ChatInputCommandInteraction } from "discord.js";
import { ICommandHandler } from "./ICommandHandler";
import { AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import z from "zod";

export class AccountSwitchModelHandler implements ICommandHandler {
  constructor(private accountSwitchModelUseCase: AccountSwitchModelUseCase) {}

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.commandName !== "account-switch") {
      return;
    }

    try {
      const model = z.string().parse(interaction.options.getString("model"));
      const result = await this.accountSwitchModelUseCase.switchModel(
        interaction.user.id,
        model
      );

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
  }
}
