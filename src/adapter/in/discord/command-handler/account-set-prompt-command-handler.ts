import { type InterfaceCommandHandlerConstructor } from "@/adapter/in/discord/command-handler/interface-command-handler";
import { type AccountSetPromptUseCase } from "@/application/port/in/account-set-prompt-use-case";
import { SlashCommandBuilder } from "discord.js";
import z from "zod";

const commandName = "set-prompt";

const AccountSetPromptCommandHandlerConstructor: InterfaceCommandHandlerConstructor<
  AccountSetPromptUseCase
> = (setAccountPrompt) => ({
  slashCommand: new SlashCommandBuilder()
    .addStringOption((option) =>
      option.setName("prompt").setDescription("對話提示詞").setRequired(true)
    )
    .setName(commandName)
    .setDescription("修改對話提示詞：提示詞，一種用來催眠大語言模型的文字"),

  handle: async (interaction) => {
    if (interaction.commandName !== commandName) {
      return;
    }

    try {
      const prompt = z.string().parse(interaction.options.getString("prompt"));

      const discordAccount = {
        accountId: interaction.user.id,
        username: interaction.user.username,
        image: interaction.user.displayAvatarURL(),
      };
      const result = await setAccountPrompt(
        discordAccount,
        prompt
      );

      await interaction.reply({
        content: `Set prompt to ${result.prompt}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Failed to set prompt",
        ephemeral: true,
      });
    }
  },
});

export default AccountSetPromptCommandHandlerConstructor;
