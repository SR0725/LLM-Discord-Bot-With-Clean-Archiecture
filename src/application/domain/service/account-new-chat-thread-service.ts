import { type AccountNewChatThreadUseCaseConstructor } from "@/application/port/in/account-new-chat-thread-use-case";
import type { Account } from "../model/account";
import { createEmptyAccount } from "../model/account";
import type { ChatThread } from "../model/chat-history";
import uuid from "@/common/uuid";

const AccountNewChatThreadUseCaseConstructor: AccountNewChatThreadUseCaseConstructor =
  (loadAccount, saveAccount) => async (discordAccount) => {
    const account = await loadAccount(discordAccount.accountId) ||
      createEmptyAccount(
        discordAccount.accountId,
        discordAccount.username
      );
    
    const newThreadId = uuid();
    const newChatThread: ChatThread = {
      accountId: account.accountId,
      threadId: newThreadId,
      useModel:  account.usedModel,
      prompt: account.prompt,
      memoryLength: account.memoryLength,
      chatHistories: [],
    };

    const updatedAccount: Account = {
      ...account,
      chatThreads: [...account.chatThreads, newChatThread],
      currentThreadId: newThreadId,
    };

    await saveAccount(updatedAccount);
    return true;
  };

export default AccountNewChatThreadUseCaseConstructor;
