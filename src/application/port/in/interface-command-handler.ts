import {
  type SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export interface InterfaceCommandHandlerConstructor<T> {
  (useCase: T): InterfaceCommandHandler<T>;
}

export interface InterfaceCommandHandler<T> {
  handle: (interaction: ChatInputCommandInteraction) => Promise<void>;
  slashCommand: SlashCommandBuilder;
}
