import { type ChatInputCommandInteraction } from "discord.js";

export interface InterfaceCommandHandler<T> {
  (useCase: T): (interaction: ChatInputCommandInteraction) => Promise<void>;
}
