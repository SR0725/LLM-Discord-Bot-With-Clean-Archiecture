import { type InterfaceCommandHandlerConstructor } from "@/application/port/in/interface-command-handler";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import z from "zod";

const AccountSwitchModelHandlerConstructor: InterfaceCommandHandlerConstructor<
  AccountSwitchModelUseCase
> = (switchAccountModel) => ({
  slashCommand: new SlashCommandBuilder()
    .addStringOption((option) =>
      option.setName("model").setDescription("模型名稱").setRequired(true)
    )
    .setName("account-switch")
    .setDescription("模型切換：用戶可以透過指令輕鬆切換當前互動的 AI 模型。"),
  handle: async (interaction) => {
    if (interaction.commandName !== "account-switch") {
      return;
    }

    try {
      const model = z.string().parse(interaction.options.getString("model"));
      const result = await switchAccountModel(
        {
          accountId: interaction.user.id,
          username: interaction.user.username,
        },
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
  },
});

export default AccountSwitchModelHandlerConstructor;
