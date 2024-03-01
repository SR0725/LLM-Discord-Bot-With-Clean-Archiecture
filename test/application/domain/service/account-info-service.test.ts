import AccountInfoUseCaseConstructor from "@/application/domain/service/account-info-service";
import { type AccountInfoUseCase } from "@/application/port/in/account-info-use-case";
import type { Account } from "@/application/domain/model/account";
import { Role } from "@/application/domain/model/chat";
import { LLMModel } from "@/application/port/in/llm-model";

describe("When account chat", () => {
  const mockLoadAccount = jest.fn();
  const mockDiscordAccount = { accountId: "123", username: "testUser", image: "https://example.com" };

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
          cost: 0
        }, {
          id: "2",
          threadId: currentThreadId,
          role: Role.Bot,
          content: "Hello, 我是機器人",
          cost: 250
        }],
      }],
    };

    it("Then return info", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);


      const useCase: AccountInfoUseCase = AccountInfoUseCaseConstructor(
        mockLoadAccount,
      );

      const response = await useCase(
        mockDiscordAccount,
      );

      expect(response).toMatchObject(expect.objectContaining({
        color: 0x039be5,
        title: "個人資料查詢",
        description: "嘎拉嘎拉",
        author: {
          name: "testUser",
          iconURL: "https://example.com"
        },
        fields: [
          {
            name: "目前使用模型",
            value: "test"
          },
          {
            name: "預設提示詞",
            value: "無"
          },
          {
            name: "允許的最高對話長度",
            value: "20"
          },
          {
            name: "對話總花費",
            value: "250 美元",
            inline: true,
          },
          {
            name: "總對話次數",
            value: "2",
            inline: true,
          }
        ],
        footer: {
          text: "開發者：@ray-realms",
          iconURL: "https://www.ray-realms.com/ray-logo.png"
        }
      }));
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
      chatThreads: [],
    };

    it("Then return info", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);


      const useCase: AccountInfoUseCase = AccountInfoUseCaseConstructor(
        mockLoadAccount,
      );

      const response = await useCase(
        mockDiscordAccount,
      );

      expect(response).toMatchObject(expect.objectContaining({
        color: 0x039be5,
        title: "個人資料查詢",
        description: "嘎拉嘎拉",
        author: {
          name: "testUser",
          iconURL: "https://example.com"
        },
        fields: [
          {
            name: "目前使用模型",
            value: "test"
          },
          {
            name: "預設提示詞",
            value: "無"
          },
          {
            name: "允許的最高對話長度",
            value: "20"
          },
          {
            name: "對話總花費",
            value: "0 美元",
            inline: true,
          },
          {
            name: "總對話次數",
            value: "0",
            inline: true,
          }
        ],
        footer: {
          text: "開發者：@ray-realms",
          iconURL: "https://www.ray-realms.com/ray-logo.png"
        }
      }));
    });
  });

  describe("Given new account", () => {
    it("Then return info", async () => {
      mockLoadAccount.mockResolvedValue(null);


      const useCase: AccountInfoUseCase = AccountInfoUseCaseConstructor(
        mockLoadAccount,
      );

      const response = await useCase(
        mockDiscordAccount,
      );

      expect(response).toMatchObject(expect.objectContaining({
        color: 0x039be5,
        title: "個人資料查詢",
        description: "嘎拉嘎拉",
        author: {
          name: "testUser",
          iconURL: "https://example.com"
        },
        fields: [
          {
            name: "目前使用模型",
            value: LLMModel.GPT3
          },
          {
            name: "預設提示詞",
            value: "無預設提示詞"
          },
          {
            name: "允許的最高對話長度",
            value: "20"
          },
          {
            name: "對話總花費",
            value: "0 美元",
            inline: true,
          },
          {
            name: "總對話次數",
            value: "0",
            inline: true,
          }
        ],
        footer: {
          text: "開發者：@ray-realms",
          iconURL: "https://www.ray-realms.com/ray-logo.png"
        }
      }));
    });
  });
});
