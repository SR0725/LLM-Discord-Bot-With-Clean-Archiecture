import AccountChatUseCaseConstructor from "@/application/domain/service/account-chat-service";
import { type AccountChatUseCase } from "@/application/port/in/account-chat-use-case";
import type { Account } from "@/application/domain/model/account";
import { Role } from "@/application/domain/model/chat";
import { LLMModel } from "@/application/port/in/llm-model";

describe("When account chat", () => {
  const mockLoadAccount = jest.fn();
  const mockSaveAccount = jest.fn();
  const mockChatWithLLM = jest.fn();
  const mockDiscordAccount =  { accountId: "123", username: "testUser", image: "https://example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given existing account with existing thread", () => {
    const accountId = "123";
    const currentThreadId = "4894303405";
    const existingAccount: Account = {
      accountId,
      username: "testUser",
      usedModel: LLMModel.test,
      prompt: "無",
      memoryLength: 20,
      currentMonthExpense: 0,
      maxMonthlyExpense: 0,
      currentThreadId: currentThreadId,
      chatThreads: [{
        accountId,
        threadId: currentThreadId,
        useModel: LLMModel.test,
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
        },{
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
        },{
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
      mockChatWithLLM.mockResolvedValue({
        role: Role.Bot,
        content: "Hello, 我是機器人",
        cost: 50
      });

      const useCase: AccountChatUseCase = AccountChatUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount,
        mockChatWithLLM
      );

      const response = await useCase(
        mockDiscordAccount,
        "Hello"
      );

      expect(typeof response).toBe("string");
    });
  });

  describe("Given existing account with existing thread but overflow memory length", () => {
    const accountId = "123";
    const currentThreadId = "4894303405";
    const existingAccount: Account = {
      accountId,
      username: "testUser",
      usedModel: LLMModel.test,
      prompt: "無",
      memoryLength: 5,
      currentMonthExpense: 0,
      maxMonthlyExpense: 0,
      currentThreadId: currentThreadId,
      chatThreads: [{
        accountId,
        threadId: currentThreadId,
        useModel: LLMModel.test,
        prompt: "無",
        memoryLength: 5,
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
        },{
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
        },{
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
      mockChatWithLLM.mockResolvedValue({
        role: Role.Bot,
        content: "Hello, 我是機器人",
        cost: 50
      });

      const useCase: AccountChatUseCase = AccountChatUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount,
        mockChatWithLLM
      );

      const response = await useCase(
        mockDiscordAccount,
        "Hello"
      );

      expect(response).toEqual("當前對話已達到上限，請使用 /newChat 開始新對話");
    });
  });

  describe("Given existing account with no thread", () => {
    const accountId = "123";
    const currentThreadId = "4894303405";
    const existingAccount: Account = {
      accountId,
      username: "testUser",
      usedModel: LLMModel.test,
      prompt: "無",
      memoryLength: 20,
      currentMonthExpense: 0,
      maxMonthlyExpense: 0,
      currentThreadId: currentThreadId,
      chatThreads: [{
        accountId,
        threadId: currentThreadId,
        useModel: LLMModel.test,
        prompt: "無",
        memoryLength: 20,
        chatHistories: [],
      }],
    };

    it("Then create new chat thread", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);
      mockChatWithLLM.mockResolvedValue({
        role: Role.Bot,
        content: "Hello, 我是機器人",
        cost: 50
      });

      const useCase: AccountChatUseCase = AccountChatUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount,
        mockChatWithLLM
      );

      const response = await useCase(
        mockDiscordAccount,
        "Hello"
      );

      expect(typeof response).toBe("string");
    });
  });

  describe("Given new account", () => {
    it("Then create new chat thread", async () => {
      mockLoadAccount.mockResolvedValue(null);
      mockChatWithLLM.mockResolvedValue({
        role: Role.Bot,
        content: "Hello, 我是機器人",
        cost: 50
      });

      const useCase: AccountChatUseCase = AccountChatUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount,
        mockChatWithLLM
      );

      const response = await useCase(
        mockDiscordAccount,
        "Hello"
      );

      expect(typeof response).toBe("string");
    });
  });
});
