import { Client, GatewayIntentBits } from "discord.js";
import setupDiscordCommandHandlers from "@/adapter/in/discord/setupDiscordCommandHandlers";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import switchAccountModel from "@/application/domain/service/account-switch-model-service";

// 初始化持久層

// 初始化服務
const accountSwitchModelUseCase: AccountSwitchModelUseCase =
  new switchAccountModel();

// 創建 Discord 客戶端實例
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
	console.log("Discord bot is ready!");
});

// 設置命令處理器
setupDiscordCommandHandlers(client, accountSwitchModelUseCase);

// 登入 Discord Bot
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
client.login(DISCORD_TOKEN);
