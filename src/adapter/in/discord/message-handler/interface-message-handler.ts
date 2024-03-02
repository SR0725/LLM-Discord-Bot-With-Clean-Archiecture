import { type Message } from "discord.js";

export interface InterfaceMessageHandlerConstructor<T> {
  (...useCase: T[]): InterfaceMessageHandler;
}

export interface InterfaceMessageHandler {
  handle: (message: Message) => Promise<void>;
}
