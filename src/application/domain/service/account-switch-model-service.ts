import { type AccountSwitchModelUseCaseConstructor } from "@/application/port/in/account-switch-model-use-case";

const switchAccountModel: AccountSwitchModelUseCaseConstructor =
  (loadAccount, updateAccount) => async (accountId, model) => {
    const account = await loadAccount(accountId);
    const updatedAccount = { ...account, usedModel: model };
    await updateAccount(updatedAccount);
    return updatedAccount;
  };

export default switchAccountModel;
