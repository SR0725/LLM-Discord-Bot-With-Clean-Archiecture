import { type InterfaceCommandHandlerConstructor } from "@/application/port/in/interface-command-handler";
import { type AccountInfoUseCase } from "@/application/port/in/account-info-use-case";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

const commandName = "account-info";

const AccountInfoCommandHandlerConstructor: InterfaceCommandHandlerConstructor<
  AccountInfoUseCase
> = (getAccountInfo) => ({
  slashCommand: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("取得當前帳戶的使用情況。"),
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
      const infoEmbedData = await getAccountInfo(discordAccount);

      const infoEmbed = new EmbedBuilder()
        .setColor(infoEmbedData.color)
        .setTitle(infoEmbedData.title)
        .setAuthor({
          name: infoEmbedData.author?.name ?? "",
          iconURL: infoEmbedData.author?.iconURL,
        })
        .setDescription(infoEmbedData.description)
        .addFields(
          ...(infoEmbedData.fields?.map((field) => ({
            name: field.name,
            value: field.value,
            inline: field.inline,
          })) ?? [])
        )
        .setTimestamp()
        .setFooter({
          text: infoEmbedData.footer?.text ?? "",
          iconURL: infoEmbedData.footer?.iconURL,
        });

      await interaction.reply({ embeds: [infoEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Failed to fetch account info.",
        ephemeral: true,
      });
    }
  },
});

export default AccountInfoCommandHandlerConstructor;
