import { Client } from "discord.js";
import { GatewayIntentBits } from "discord.js";
import SetupDiscordCommandHandlers, {
  type ServiceList as CommandUseServiceList,
} from "./command-handler/setup-handlers";
import SetupDiscordMessageHandlers, {
  type ServiceList as MessageUseServiceList,
} from "./message-handler/setup-handlers";

function SetupDiscordHandlers(
  token: string,
  clientId: string,
  guildId: string,
  services: CommandUseServiceList & MessageUseServiceList
): void {
  const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  client.login(token);
  client.once("ready", () => {
    console.log("Discord bot is ready!");
  });

  SetupDiscordCommandHandlers(client, token, clientId, guildId, services);
  SetupDiscordMessageHandlers(client, services);
}

export default SetupDiscordHandlers;
