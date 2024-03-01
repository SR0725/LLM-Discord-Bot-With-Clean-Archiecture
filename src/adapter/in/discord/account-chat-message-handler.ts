import { type InterfaceMessageHandlerConstructor } from "@/application/port/in/interface-message-handler";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";

const commandName = "chat";

const AccountChatMessageHandlerConstructor: InterfaceMessageHandlerConstructor<
  AccountChatUseCase
> = (chat) => ({
  handle: async (message) => {
    // :chat => chat
    const command = message.content.slice(1).trim().split(" ")[0];
    if (command !== commandName) {
      return;
    }

    try {
      const messagePrompt = message.content
        .slice(1)
        .trim()
        .split(" ")
        .slice(1)
        .join(" ");

      if (!messagePrompt) {
        await message.channel.send("請輸入訊息");
        return;
      }

      message.channel.sendTyping();
      const typingInterval = setInterval(() => {
        message.channel.sendTyping();
      }, 5000);

      const discordAccount = {
        accountId: message.author.id,
        username: message.author.username,
        image: message.author.displayAvatarURL(),
      };

      const response = await chat(discordAccount, messagePrompt);

      clearInterval(typingInterval);
      await message.channel.send(response);
    } catch (error) {
      console.error(error);
      await message.channel.send(
        `對話失敗 ${JSON.stringify(error).slice(0, 200)}...`
      );
    }
  },
});

export default AccountChatMessageHandlerConstructor;
