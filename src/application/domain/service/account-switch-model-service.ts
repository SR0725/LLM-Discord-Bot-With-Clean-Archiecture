import { type AccountSwitchModelUseCaseConstructor } from "@/application/port/in/account-switch-model-use-case";

const AccountSwitchModelUseCaseConstructor: AccountSwitchModelUseCaseConstructor =
  (createAccount, loadAccount, updateAccount) => async (accountId, model) => {
    const account = await loadAccount(accountId);
    if (!account) {
      const newAccount = await createAccount(accountId);
    }
    const updatedAccount = { ...account, usedModel: model };
    await updateAccount(updatedAccount);
    return updatedAccount;
  };

export default AccountSwitchModelUseCaseConstructor;
