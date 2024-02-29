import AccountSwitchModelUseCaseConstructor from "@/application/domain/service/account-switch-model-service";
import { type AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import type { Account } from "@/application/domain/model/account";

describe("When account switch model use case", () => {
  const mockLoadAccount = jest.fn();
  const mockSaveAccount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given existing account", () => {
    const existingAccount: Account = {
      accountId: "123",
      username: "testUser",
      usedModel: "oldModel",
      prompt: "",
      memoryLength: 20,
      currentMonthExpense: 0,
      maxMonthlyExpense: 0,
      chatThreads: [],
      currentThreadId: null,
    };

    it("Then updates model", async () => {
      mockLoadAccount.mockResolvedValue(existingAccount);
      const useCase: AccountSwitchModelUseCase = AccountSwitchModelUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount
      );

      const updatedAccount = await useCase(
        { accountId: "123", username: "testUser" },
        "newModel"
      );

      expect(mockSaveAccount).toHaveBeenCalledWith({
        ...existingAccount,
        usedModel: "newModel",
      });
      expect(updatedAccount.usedModel).toEqual("newModel");
    });
  });

  describe("Given new account", () => {

    it("Then create model", async () => {
      mockLoadAccount.mockResolvedValue(null);
      const useCase: AccountSwitchModelUseCase = AccountSwitchModelUseCaseConstructor(
        mockLoadAccount,
        mockSaveAccount
      );

      const newAccountId = "456";
      const newUsername = "newUser";
      const newModel = "newModel";
      const newAccount = await useCase(
        { accountId: newAccountId, username: newUsername },
        newModel
      );

      expect(mockSaveAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: newAccountId,
          username: newUsername,
          usedModel: newModel,
        })
      );
      expect(newAccount).toEqual(
        expect.objectContaining({
          accountId: newAccountId,
          username: newUsername,
          usedModel: newModel,
        })
      );
    });
  });
});
