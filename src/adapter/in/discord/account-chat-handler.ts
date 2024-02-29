import { type InterfaceCommandHandlerConstructor } from "@/application/port/in/interface-command-handler";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import { SlashCommandBuilder } from "discord.js";
import z from "zod";

const commandName = "chat";

const AccountNewChatHandlerConstructor: InterfaceCommandHandlerConstructor<
  AccountChatUseCase
> = (chat) => ({
  slashCommand: new SlashCommandBuilder()
    .addStringOption((option) =>
      option.setName("message").setDescription("對話文字").setRequired(true)
    )
    .setName(commandName)
    .setDescription("繼續對話"),

  handle: async (interaction) => {
    if (interaction.commandName !== commandName) {
      return;
    }

    try {
      const message = z
        .string()
        .parse(interaction.options.getString("message"));

      if (!message) {
        await interaction.reply({
          content: `請輸入對話文字`,
        });
        return;
      }

      const response = await chat(
        {
          accountId: interaction.user.id,
          username: interaction.user.username,
        },
        message
      );

      console.log("response", response);

      await interaction.reply({
        content:
          `${interaction.user.username} 說：${message}\n` +
          `大語言模型回應：${response}\n`,
        isMessage: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `對話失敗 ${JSON.stringify(error).slice(0, 200)}...`,
      });
    }
  },
});

export default AccountNewChatHandlerConstructor;
