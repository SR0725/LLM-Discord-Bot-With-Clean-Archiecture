import { type InterfaceMessageHandlerConstructor } from "@/adapter/in/discord/message-handler/interface-message-handler";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import uuid from "@/common/uuid";
import discordChatTypeHandler from "./discord-chat-typing-handler";
import downloadFileFromUrl from "@/common/download-file-from-url";

const AccountChatMessageHandlerConstructor: InterfaceMessageHandlerConstructor<
  AccountChatUseCase
> = (chat) => ({
  handle: async (message) => {
    // TODO: 目前是直接判斷是否有提及 bot，才觸發相關功能
    // 不過感覺程式設計上很通靈，待改進
    if (!message.content.startsWith("<@1211656440331112498>")) {
      return;
    }

    try {
      // 取得訊息內容
      const messagePrompt = message.content
        .slice(1)
        .trim()
        .split(" ")
        .slice(1)
        .join(" ");

      // 取得訊息附件
      const imagePaths = (
        await Promise.all(
          message.attachments.map(async (attachment) => {
            // 如果沒有圖片路徑或者沒有圖片類型，則不處理
            if (!attachment.contentType || !attachment.url) {
              return null;
            }

            // 只儲存 png 或 jpeg 圖片
            if (
              !attachment.contentType.includes("image/png") &&
              !attachment.contentType.includes("image/jpeg")
            ) {
              return null;
            }

            const path = `./data/temp-file/${uuid()}.${
              attachment.contentType.split("/")[1]
            }`;

            await downloadFileFromUrl(attachment.url, path);

            return {
              path,
              mimeType: attachment.contentType,
            };
          })
        )
      ).filter((imagePath) => imagePath !== null) as {
        path: string;
        mimeType: "image/png" | "image/jpeg";
      }[];

      if (!messagePrompt) {
        await message.channel.send("請輸入訊息");
        return;
      }

      // 顯示正在打字
      const { startTyping, stopTyping } = discordChatTypeHandler(
        message.channel
      );
      startTyping();

      // 取得使用者資訊
      const discordAccount = {
        accountId: message.author.id,
        username: message.author.username,
        image: message.author.displayAvatarURL(),
      };

      try {
        // 取得回應
        const response = await chat(discordAccount, messagePrompt, imagePaths);

        if (response.length > 1000) {
          // 分段回應
          const responseParts = response.match(/[\s\S]{1,1000}/g) ?? [];
          for (const responsePart of responseParts) {
            await message.channel.send(responsePart);
          }
        } else {
          await message.channel.send(response);
        }
      } catch (error) {
        throw new Error(`對話失敗 ${JSON.stringify(error).slice(0, 200)}...`);
      } finally {
        stopTyping();
      }
    } catch (error) {
      console.error(error);
      await message.channel.send(
        `對話失敗 ${JSON.stringify(error).slice(0, 200)}...`
      );
    }
  },
});

export default AccountChatMessageHandlerConstructor;
