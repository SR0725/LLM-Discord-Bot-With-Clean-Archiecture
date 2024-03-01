import { type AccountInfoUseCaseConstructor } from "@/application/port/in/account-info-use-case";
import { createEmptyAccount } from "../model/account";

const AccountInfoUseCaseConstructor: AccountInfoUseCaseConstructor =
  (loadAccount) => async (discordAccount) => {
    const account = await loadAccount(discordAccount.accountId) ?? createEmptyAccount(discordAccount.accountId, discordAccount.username);
    const totalCost = account.chatThreads.reduce((acc, thread) => {
      return acc + thread.chatHistories.reduce((acc, chat) => acc + chat.cost, 0);
    }, 0);

    const totalChatCount = account.chatThreads.reduce((acc, thread) => {
      return acc + thread.chatHistories.length;
    }, 0);

    return {
      color: 0x039be5,
      title: "個人資料查詢",
      description: "嘎拉嘎拉",
      author: {
        name: account.username,
        iconURL: discordAccount.image
      },
      fields: [
        {
          name: "目前使用模型",
          value: account.usedModel,
        },
        {
          name: "預設提示詞",
          value: account.prompt || "無預設提示詞",
        },
        {
          name: "允許的最高對話長度",
          value: String(account.memoryLength),
        },
        {
          name: "對話總花費",
          value: `${totalCost} 美元`,
          inline: true,
        },
        {
          name: "總對話次數",
          value: String(totalChatCount),
          inline: true,
        }
      ],
      footer: {
        text: "開發者：@ray-realms",
        iconURL: "https://www.ray-realms.com/ray-logo.png"
      }
    };
  };

export default AccountInfoUseCaseConstructor;
