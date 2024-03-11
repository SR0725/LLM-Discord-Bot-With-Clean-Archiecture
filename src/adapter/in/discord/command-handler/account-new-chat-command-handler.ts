import { type InterfaceCommandHandlerConstructor } from "@/adapter/in/discord/command-handler/interface-command-handler";
import { type AccountNewChatThreadUseCase } from "@/application/port/in/account-new-chat-thread-use-case";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import { SlashCommandBuilder } from "discord.js";

const commandName = "new-chat";

const AccountNewChatCommandHandlerConstructor: InterfaceCommandHandlerConstructor<
  [AccountNewChatThreadUseCase, AccountChatUseCase]
> = ([newChatThread, chat]) => ({
  slashCommand: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("開啟新的對話，並設定對話文字"),

  handle: async (interaction) => {
    if (interaction.commandName !== commandName) {
      return;
    }

    try {
      const discordAccount = {
        accountId: interaction.user.id,
        username: interaction.user.username,
        image: interaction.user.displayAvatarURL(),
      };

      await newChatThread(discordAccount);

      await interaction.reply({
        content: "已開啟新的對話",
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `對話開啟失敗${JSON.stringify(error)}`,
      });
    }
  },
});

export default AccountNewChatCommandHandlerConstructor;
