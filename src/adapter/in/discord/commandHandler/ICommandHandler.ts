import { ChatInputCommandInteraction } from "discord.js";

export interface ICommandHandler {
  handle(interaction: ChatInputCommandInteraction): Promise<void>;
}
