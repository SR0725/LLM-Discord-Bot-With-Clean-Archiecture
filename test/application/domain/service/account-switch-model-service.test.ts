import AccountSwitchModelUseCaseConstructor from "@/application/domain/service/account-switch-model-service";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import type { Account } from "@/application/domain/model/account";
import { LLMModel } from "@/application/port/in/llm-model";

describe("When account switch model use case", () => {
  const mockLoadAccount = jest.fn();
  const mockSaveAccount = jest.fn();
  const mockDiscordAccount = {
    accountId: "123",
    username: "testUser",
    image: "https://example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given existing account", () => {
    const existingAccount: Account = {
      accountId: "123",
      username: "testUser",
      usedModel: LLMModel.GPT3,
      prompt: "",
      maxChatLength: 20,
      remainingChatPoints: 1000,
      chatThreads: [],
      currentThreadId: null,
    };

    it("Then updates model", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);
      const newModel = LLMModel.GPT4;
      const useCase: AccountSwitchModelUseCase =
        AccountSwitchModelUseCaseConstructor(mockLoadAccount, mockSaveAccount);

      const updatedAccount = await useCase(mockDiscordAccount, newModel);

      expect(mockSaveAccount).toHaveBeenCalledWith({
        ...existingAccount,
        usedModel: newModel,
      });
      expect(updatedAccount.usedModel).toEqual(newModel);
    });
  });

  describe("Given new account", () => {
    it("Then create model", async () => {
      mockLoadAccount.mockResolvedValue(null);
      const useCase: AccountSwitchModelUseCase =
        AccountSwitchModelUseCaseConstructor(mockLoadAccount, mockSaveAccount);

      const newModel = LLMModel.GPT4;
      const newAccount = await useCase(mockDiscordAccount, newModel);

      expect(mockSaveAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: mockDiscordAccount.accountId,
          username: mockDiscordAccount.username,
          usedModel: newModel,
        })
      );
      expect(newAccount).toEqual(
        expect.objectContaining({
          accountId: mockDiscordAccount.accountId,
          username: mockDiscordAccount.username,
          usedModel: newModel,
        })
      );
    });
  });
});
