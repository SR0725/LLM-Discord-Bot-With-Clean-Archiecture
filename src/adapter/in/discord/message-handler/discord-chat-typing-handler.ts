import { Message } from "discord.js";

function discordChatTypeHandler(
  channel: Message<boolean>["channel"],
  maxTypingTimes: number = 10
) {
  let typingTimes = 0;
  let typingInterval: NodeJS.Timeout | null = null;

  const startTyping = () => {
    channel.sendTyping();
    typingInterval = setInterval(() => {
      typingTimes++;
      channel.sendTyping();
      if (typingTimes >= maxTypingTimes) {
        stopTyping();
      }
    }, 5000);
  };

  const stopTyping = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
    }
  };

  return {
    startTyping,
    stopTyping,
  };
}

export default discordChatTypeHandler;
