import AccountSetPromptUseCaseConstructor from "@/application/domain/service/account-set-prompt-service";
import { type AccountSetPromptUseCase } from "@/application/port/in/account-set-prompt-use-case";
import type { Account } from "@/application/domain/model/account";
import { LLMModel } from "@/application/port/in/llm-model";

describe("When account set prompt", () => {
  const mockLoadAccount = jest.fn();
  const mockSaveAccount = jest.fn();
  const mockDiscordAccount =  { accountId: "123", username: "testUser", image: "https://example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given existing account", () => {
    const existingAccount: Account = {
      accountId: "123",
      username: "testUser",
      usedModel: LLMModel.GPT3,
      prompt: "無",
      maxChatLength: 20,
      remainingChatPoints: 1000,
      chatThreads: [],
      currentThreadId: null,
    };

    it("Then updates model", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);
      const useCase: AccountSetPromptUseCase = AccountSetPromptUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount
      );
      const newPrompt = "貓咪";
      const updatedAccount = await useCase(
        mockDiscordAccount,
        newPrompt
      );

      expect(mockSaveAccount).toHaveBeenCalledWith({
        ...existingAccount,
        prompt: newPrompt,
      });
      expect(updatedAccount.prompt).toEqual(newPrompt);
    });
  });

  describe("Given new account", () => {

    it("Then create model", async () => {
      mockLoadAccount.mockResolvedValue(null);
      const useCase: AccountSetPromptUseCase = AccountSetPromptUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount
      );

      const prompt = "狗勾";
      const newAccount = await useCase(
        mockDiscordAccount,
        prompt
      );

      expect(mockSaveAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: mockDiscordAccount.accountId,
          username: mockDiscordAccount.username,
          prompt: prompt,
        })
      );
      expect(newAccount).toEqual(
        expect.objectContaining({
          accountId: mockDiscordAccount.accountId,
          username: mockDiscordAccount.username,
          prompt: prompt,
        })
      );
    });
  });
});
