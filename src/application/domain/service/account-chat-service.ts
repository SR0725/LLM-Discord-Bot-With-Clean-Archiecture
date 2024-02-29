import { type AccountChatUseCaseConstructor } from "@/application/port/in/account-chat-use-case";
import { createEmptyAccount } from "../model/account";
import uuid from "@/common/uuid";
import type { ChatHistory} from "../model/chat";
import { Role } from "../model/chat";

const AccountChatUseCaseConstructor: AccountChatUseCaseConstructor =
  (loadAccount, saveAccount, chatWithLLM) => async (discordAccount, message) => {
    const account = await loadAccount(discordAccount.accountId) ?? createEmptyAccount(discordAccount.accountId, discordAccount.username);
    const currentThread = account.chatThreads.find((thread) => thread.threadId === account.currentThreadId) ?? {
      accountId: account.accountId,
      threadId: uuid(),
      useModel: account.usedModel,
      prompt: account.prompt,
      memoryLength: account.memoryLength,
      chatHistories: []
    };
    const currentThreadId = currentThread.threadId;

    if (currentThread.chatHistories.length + 1 >= account.memoryLength) {
      return "當前對話已達到上限，請使用 /newChat 開始新對話";
    }

    const chatHistoriesWithNewMessage = [
      ...currentThread.chatHistories,
      {
        id: uuid(),
        threadId: currentThreadId,
        role: Role.User,
        content: message,
        cost: 0
      }
    ];

    const response = await chatWithLLM(account.usedModel, currentThread.prompt, chatHistoriesWithNewMessage);

    const chatHistoriesWithNewMessageWithBotMessage:ChatHistory[] = [...chatHistoriesWithNewMessage, {
      id: uuid(),
      threadId: currentThreadId,
      role: Role.Bot,
      content: response.content,
      cost: response.cost
    }];

    saveAccount({
      ...account,
      currentThreadId,
      chatThreads: account.chatThreads.map((thread) => thread.threadId === currentThreadId ? {
        ...thread,
        chatHistories: chatHistoriesWithNewMessageWithBotMessage
      } : thread)
    });

    return response.content;
  };

export default AccountChatUseCaseConstructor;
