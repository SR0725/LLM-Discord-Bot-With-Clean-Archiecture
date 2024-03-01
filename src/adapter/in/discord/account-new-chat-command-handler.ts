import { type InterfaceCommandHandlerConstructor } from "@/application/port/in/interface-command-handler";
import { type AccountNewChatThreadUseCase } from "@/application/port/in/account-new-chat-thread-use-case";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import { SlashCommandBuilder } from "discord.js";
import z from "zod";

const commandName = "new-chat";

const AccountNewChatCommandHandlerConstructor: InterfaceCommandHandlerConstructor<
  [AccountNewChatThreadUseCase, AccountChatUseCase]
> = ([newChatThread, chat]) => ({
  slashCommand: new SlashCommandBuilder()
    .addStringOption((option) =>
      option.setName("message").setDescription("對話文字")
    )
    .setName(commandName)
    .setDescription("開啟新的對話，並設定對話文字"),

  handle: async (interaction) => {
    if (interaction.commandName !== commandName) {
      return;
    }


    try {
      const message = z
        .string()
        .parse(interaction.options.getString("message"));

      const discordAccount = {
        accountId: interaction.user.id,
        username: interaction.user.username,
        image: interaction.user.displayAvatarURL(),
      };

      await newChatThread(discordAccount);

      if (!message) {
        await interaction.reply({
          content: "已開啟新的對話",
        });
        return;
      }

      const response = await chat(
        discordAccount,
        message
      );

      await interaction.reply({
        content: `已開啟新的對話\n${response}`,
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
