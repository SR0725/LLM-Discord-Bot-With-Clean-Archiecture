import AccountInfoUseCaseConstructor from "@/application/domain/service/account-info-service";
import { type AccountInfoUseCase } from "@/application/port/in/account-info-use-case";
import type { Account } from "@/application/domain/model/account";
import { Role } from "@/application/domain/model/chat";
import { LLMModel } from "@/application/port/in/llm-model";

describe("When account chat", () => {
  const mockLoadAccount = jest.fn();
  const mockDiscordAccount = {
    accountId: "123",
    username: "testUser",
    image: "https://example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given existing account", () => {
    const accountId = "123";
    const currentThreadId = "4894303405";
    const existingAccount: Account = {
      accountId,
      username: "testUser",
      usedModel: LLMModel.test,
      prompt: "無",
      maxChatLength: 20,
      remainingChatPoints: 1000,
      currentThreadId: currentThreadId,
      chatThreads: [
        {
          accountId,
          threadId: currentThreadId,
          useModel: LLMModel.test,
          prompt: "無",
          maxChatLength: 20,
          chatHistories: [
            {
              id: "1",
              threadId: currentThreadId,
              role: Role.Bot,
              content: "Hello",
              cost: 50,
              timestamp: new Date().getTime(),
            },
            {
              id: "2",
              threadId: currentThreadId,
              role: Role.Bot,
              content: "Hello, 我是機器人",
              cost: 50,
              timestamp: new Date().getTime(),
            },
            {
              id: "1",
              threadId: currentThreadId,
              role: Role.Bot,
              content: "Hello",
              cost: 50,
              timestamp: new Date().getTime(),
            },
            {
              id: "2",
              threadId: currentThreadId,
              role: Role.Bot,
              content: "Hello, 我是機器人",
              cost: 50,
              timestamp: new Date().getTime(),
            },
            {
              id: "1",
              threadId: currentThreadId,
              role: Role.Bot,
              content: "Hello",
              cost: 50,
              timestamp: new Date().getTime(),
            },
            {
              id: "2",
              threadId: currentThreadId,
              role: Role.Bot,
              content: "Hello, 我是機器人",
              cost: 50,
              timestamp: new Date().getTime(),
            },
          ],
        },
      ],
    };

    it("Then return info", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);

      const useCase: AccountInfoUseCase =
        AccountInfoUseCaseConstructor(mockLoadAccount);

      const response = await useCase(mockDiscordAccount);

      expect(response).toMatchObject(
        expect.objectContaining({
          color: 0x039be5,
          title: "個人資料查詢",
          description: "使用 /help 查看所有指令",
          author: {
            name: "testUser",
            iconURL: "https://example.com",
          },
          fields: [
            {
              name: "剩餘點數 (1 美元 1000 點)",
              value: "1000",
            },
            {
              name: "目前使用模型",
              value: "test",
            },
            {
              name: "預設提示詞",
              value: "無",
            },
            {
              name: "允許的最高對話長度",
              value: "20",
            },
            {
              name: "本月總花費",
              value: `300 美元`,
              inline: true,
            },
            {
              name: "對話總花費",
              value: "300 美元",
              inline: true,
            },
            {
              name: "總對話次數",
              value: "6",
              inline: true,
            },
          ],
          footer: {
            text: "開發者：@ray-realms",
            iconURL: "https://www.ray-realms.com/ray-logo.png",
          },
        })
      );
    });
  });

  describe("Given new account", () => {
    it("Then return info", async () => {
      mockLoadAccount.mockResolvedValue(null);

      const useCase: AccountInfoUseCase =
        AccountInfoUseCaseConstructor(mockLoadAccount);

      const response = await useCase(mockDiscordAccount);

      expect(response).toMatchObject(
        expect.objectContaining({
          color: 0x039be5,
          title: "個人資料查詢",
          description: "使用 /help 查看所有指令",
          author: {
            name: "testUser",
            iconURL: "https://example.com",
          },
          fields: [
            {
              name: "剩餘點數 (1 美元 1000 點)",
              value: "1000",
            },
            {
              name: "目前使用模型",
              value: LLMModel.GEMINI_PRO,
            },
            {
              name: "預設提示詞",
              value: "無預設提示詞",
            },
            {
              name: "允許的最高對話長度",
              value: "20",
            },
            {
              name: "本月總花費",
              value: `0 美元`,
              inline: true,
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
            },
          ],
          footer: {
            text: "開發者：@ray-realms",
            iconURL: "https://www.ray-realms.com/ray-logo.png",
          },
        })
      );
    });
  });
});
