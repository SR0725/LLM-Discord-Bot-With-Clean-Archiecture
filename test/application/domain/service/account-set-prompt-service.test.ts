import AccountSetPromptUseCaseConstructor from "@/application/domain/service/account-set-prompt-service";
import { type AccountSetPromptUseCase } from "@/application/port/in/account-set-prompt-use-case";
import type { Account } from "@/application/domain/model/account";

describe("When account set prompt", () => {
  const mockLoadAccount = jest.fn();
  const mockSaveAccount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given existing account", () => {
    const existingAccount: Account = {
      accountId: "123",
      username: "testUser",
      usedModel: "gpt-3.5",
      prompt: "無",
      memoryLength: 20,
      currentMonthExpense: 0,
      maxMonthlyExpense: 0,
      chatHistories: [],
    };

    it("Then updates model", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);
      const useCase: AccountSetPromptUseCase = AccountSetPromptUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount
      );
      const newPrompt = "貓咪";
      const updatedAccount = await useCase(
        { accountId: "123", username: "testUser" },
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

      const newAccountId = "456";
      const newUsername = "newUser";
      const prompt = "狗勾";
      const newAccount = await useCase(
        { accountId: newAccountId, username: newUsername },
        prompt
      );

      expect(mockSaveAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: newAccountId,
          username: newUsername,
          prompt: prompt,
        })
      );
      expect(newAccount).toEqual(
        expect.objectContaining({
          accountId: newAccountId,
          username: newUsername,
          prompt: prompt,
        })
      );
    });
  });
});
