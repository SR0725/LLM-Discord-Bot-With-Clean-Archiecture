import type { Client } from "discord.js";
import type { InterfaceMessageHandler } from "./interface-message-handler";

function setupMessageActiveHandler(
  client: Client,
  handlers: InterfaceMessageHandler[]
) {
  client.on("messageCreate", async (message) => {
    if (message.content.includes("<@1211656440331112498>")) {
      handlers.forEach((h) => h.handle(message));
    }
  });
}

export default setupMessageActiveHandler;
