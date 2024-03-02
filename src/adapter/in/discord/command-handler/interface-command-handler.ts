import {
  type SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export interface InterfaceCommandHandlerConstructor<T> {
  (...useCase: T[]): InterfaceCommandHandler;
}

export interface InterfaceCommandHandler {
  handle: (interaction: ChatInputCommandInteraction) => Promise<void>;
  slashCommand: SlashCommandBuilder;
}
