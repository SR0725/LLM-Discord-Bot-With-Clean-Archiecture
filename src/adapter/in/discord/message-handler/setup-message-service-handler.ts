import { Client } from "discord.js";
import { InterfaceMessageHandler } from "./interface-message-handler";

function setupMessageActiveHandler(
  client: Client,
  handlers: InterfaceMessageHandler[]
) {
  client.on("messageCreate", async (message) => {
    if (message.content.startsWith(":")) {
      handlers.forEach((h) => h.handle(message));
    }
  });
}

export default setupMessageActiveHandler;
