import { REST, Routes, GatewayIntentBits } from "discord.js";
import { InterfaceCommandHandler } from "./interface-command-handler";

async function setupSlashCommand(
  token: string,
  clientId: string,
  guildId: string,
  handlers: InterfaceCommandHandler[]
) {
  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("Started refreshing application (/) commands.");

    // rest
    //   .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
    //   .then(() => console.log("Successfully deleted all guild commands."))
    //   .catch(console.error);

    // rest
    //   .put(Routes.applicationCommands(clientId), { body: [] })
    //   .then(() => console.log("Successfully deleted all application commands."))
    //   .catch(console.error);

    await rest.put(Routes.applicationCommands(clientId), {
      body: handlers.map((h) => h.slashCommand),
    });

    console.log(
      "Successfully registered commands:".concat(
        handlers.map((h) => h.slashCommand.name).join(", ")
      )
    );
  } catch (error) {
    console.error(error);
  }
}

export default setupSlashCommand;
