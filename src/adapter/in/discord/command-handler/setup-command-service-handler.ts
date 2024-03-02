import { Client } from "discord.js";
import { InterfaceCommandHandler } from "./interface-command-handler";

function setupCommandServiceHandler(
  client: Client,
  handlers: InterfaceCommandHandler[]
) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    handlers.forEach((h) => h.handle(interaction));
  });
}

export default setupCommandServiceHandler;
