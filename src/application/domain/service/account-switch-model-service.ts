import { type AccountSwitchModelUseCaseConstructor } from "@/application/port/in/account-switch-model-use-case";
import { Account, createEmptyAccount } from "../model/account";

const AccountSwitchModelUseCaseConstructor: AccountSwitchModelUseCaseConstructor =
  (loadAccount, saveAccount) => async (discordAccount, model) => {
    const account: Account = (await loadAccount(discordAccount.accountId)) ?? {
      ...createEmptyAccount(discordAccount.accountId, discordAccount.username),
    };

    const updatedAccount = { ...account, usedModel: model };
    await saveAccount(updatedAccount);
    return updatedAccount;
  };

export default AccountSwitchModelUseCaseConstructor;
