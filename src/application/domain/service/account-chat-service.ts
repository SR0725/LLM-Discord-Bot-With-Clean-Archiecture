import { type AccountChatUseCaseConstructor } from "@/application/port/in/account-chat-use-case";
import { createEmptyAccount } from "../model/account";
import uuid from "@/common/uuid";
import type { ChatHistory } from "../model/chat";
import { Role } from "../model/chat";

const AccountChatUseCaseConstructor: AccountChatUseCaseConstructor =
  (loadAccount, saveAccount, chatWithLLM) =>
  async (discordAccount, message) => {
    // 加載用戶賬戶，如果不存在則創建一個新的賬戶
    const account =
      (await loadAccount(discordAccount.accountId)) ??
      createEmptyAccount(discordAccount.accountId, discordAccount.username);

    // 查找當前對話，如果沒有一個正在進行的對話則創建一個新的對話
    const currentThread = account.chatThreads.find(
      (thread) => thread.threadId === account.currentThreadId
    ) ?? {
      accountId: account.accountId,
      threadId: uuid(),
      useModel: account.usedModel,
      prompt: account.prompt,
      maxChatLength: account.maxChatLength,
      chatHistories: [],
    };
    const isNewThread = !account.chatThreads.some(
      (thread) => thread.threadId === currentThread.threadId
    );
    const currentThreadId = currentThread.threadId;

    // 如果當前對話已達到上限，則返回警告消息
    if (currentThread.chatHistories.length + 1 >= account.maxChatLength) {
      return "當前對話已達到上限，請使用 /newChat 開始新對話";
    }

    // 如果用戶剩餘對話點數不足，則返回警告消息
    if (account.remainingChatPoints <= 0) {
      return "你的對話點數不足，請私訊 <@572004405780545536> 購買點數";
    }

    // 建立一個包含新消息的新對話歷史
    const chatHistoriesWithNewMessage: ChatHistory[] = [
      ...currentThread.chatHistories,
      {
        id: uuid(),
        timestamp: new Date().getTime(),
        threadId: currentThreadId,
        role: Role.User,
        content: message,
        cost: 0,
      },
    ];

    // 將新對話歷史傳遞給語言模型，獲取回應
    const response = await chatWithLLM(
      account.usedModel,
      currentThread.prompt,
      chatHistoriesWithNewMessage
    );

    // 建立一個包含新消息和機器人回應的新對話歷史
    const chatHistoriesWithNewMessageWithBotMessage: ChatHistory[] = [
      ...chatHistoriesWithNewMessage,
      {
        id: uuid(),
        timestamp: new Date().getTime(),
        threadId: currentThreadId,
        role: Role.Bot,
        content: response.content,
        cost: response.cost,
      },
    ];

    // 計算本次對話的花費點數，單位是 1000 點每美元
    const costPoint = response.cost * 1000;

    // 更新用戶賬戶，包含新的對話歷史與點數
    saveAccount({
      ...account,
      currentThreadId,
      chatThreads: isNewThread
        ? [
            ...account.chatThreads,
            {
              ...currentThread,
              chatHistories: chatHistoriesWithNewMessageWithBotMessage,
            },
          ]
        : account.chatThreads.map((thread) =>
            thread.threadId === currentThreadId
              ? {
                  ...thread,
                  chatHistories: chatHistoriesWithNewMessageWithBotMessage,
                }
              : thread
          ),
      remainingChatPoints: account.remainingChatPoints - costPoint,
    });

    // 返回機器人回應
    return response.content;
  };

export default AccountChatUseCaseConstructor;
