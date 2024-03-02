import { type InterfaceMessageHandlerConstructor } from "@/application/port/in/interface-message-handler";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import fs from "fs";
import http from "https";
import uuid from "@/common/uuid";
import { Attachment } from "discord.js";

const commandName = "chat";

async function downloadFileFromUrl(
  url: string,
  path: string
): Promise<Boolean> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path);
    http.get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve(true);
      });

      file.on("error", (error) => {
        fs.unlink(path, () => {});
        reject(error);
      });
    });
  });
}

const AccountChatMessageHandlerConstructor: InterfaceMessageHandlerConstructor<
  AccountChatUseCase
> = (chat) => ({
  handle: async (message) => {
    /// 取得訊息內容中的前幾個字元是否為觸發指令
    const command = message.content.slice(1).trim().split(" ")[0];
    if (command !== commandName) {
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
      message.channel.sendTyping();
      const typingInterval = setInterval(() => {
        message.channel.sendTyping();
      }, 5000);

      // 取得使用者資訊
      const discordAccount = {
        accountId: message.author.id,
        username: message.author.username,
        image: message.author.displayAvatarURL(),
      };

      // 取得回應
      const response = await chat(discordAccount, messagePrompt, imagePaths);

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
