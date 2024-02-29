import AccountNewChatThreadUseCaseConstructor from "@/application/domain/service/account-new-chat-thread-service";
import { type AccountNewChatThreadUseCase } from "@/application/port/in/account-new-chat-thread-use-case";
import type { Account } from "@/application/domain/model/account";
import { Role } from "@/application/domain/model/chat-history";

describe("When account renew a chat thread", () => {
  const mockLoadAccount = jest.fn();
  const mockSaveAccount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given existing account with existing thread", () => {
    const accountId = "123";
    const currentThreadId = "2ktof92";
    const existingAccount: Account = {
      accountId,
      username: "testUser",
      usedModel: "gpt-3.5",
      prompt: "無",
      memoryLength: 20,
      currentMonthExpense: 0,
      maxMonthlyExpense: 0,
      currentThreadId: currentThreadId,
      chatThreads: [{
        accountId,
        threadId: currentThreadId,
        useModel: "gpt-3.5",
        prompt: "無",
        memoryLength: 20,
        chatHistories: [{
          id: "1",
          threadId: currentThreadId,
          role: Role.Bot,
          content: "Hello",
          cost: 50
        }, {
          id: "2",
          threadId: currentThreadId,
          role: Role.Bot,
          content: "Hello, 我是機器人",
          cost: 50
        }],
      }],
    };

    it("Then create new chat thread", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);
      const useCase: AccountNewChatThreadUseCase = AccountNewChatThreadUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount,
      );

      await useCase(
        { accountId: "123", username: "testUser" },
      );

      expect(mockSaveAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingAccount,
          currentThreadId: expect.not.stringMatching(currentThreadId),
          chatThreads: [
            ...existingAccount.chatThreads,
            {
              accountId,
              threadId: expect.any(String),
              useModel: existingAccount.usedModel,
              prompt: existingAccount.prompt,
              memoryLength: existingAccount.memoryLength,
              chatHistories: [],
            }
          ]
        }));
    });
  });

  describe("Given existing account with no thread", () => {
    const accountId = "123";
    const existingAccount: Account = {
      accountId,
      username: "testUser",
      usedModel: "gpt-3.5",
      prompt: "無",
      memoryLength: 20,
      currentMonthExpense: 0,
      maxMonthlyExpense: 0,
      currentThreadId: null,
      chatThreads: [],
    };

    it("Then create new chat thread", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);
      const useCase: AccountNewChatThreadUseCase = AccountNewChatThreadUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount,
      );

      await useCase(
        { accountId: "123", username: "testUser" },
      );

      expect(mockSaveAccount).toHaveBeenCalledWith({
        ...existingAccount,
        currentThreadId: expect.any(String),
        chatThreads: [
          {
            accountId,
            threadId: expect.any(String),
            useModel: existingAccount.usedModel,
            prompt: existingAccount.prompt,
            memoryLength: existingAccount.memoryLength,
            chatHistories: [],
          }
        ]
      });
    });
  });

  describe("Given new account", () => {
    it("Then create new chat thread", async () => {
      mockLoadAccount.mockResolvedValue(null);
      const useCase: AccountNewChatThreadUseCase = AccountNewChatThreadUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount,
      );

      const newAccountId = "456";
      const newUsername = "newUser";
      await useCase(
        { accountId: newAccountId, username: newUsername },
      );

      expect(mockSaveAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: newAccountId,
          username: newUsername,
          chatThreads: expect.objectContaining([
            expect.objectContaining({
              accountId: newAccountId,
              threadId: expect.any(String),
              chatHistories: [],
            })
          ])
        }));
    });
  });
});
