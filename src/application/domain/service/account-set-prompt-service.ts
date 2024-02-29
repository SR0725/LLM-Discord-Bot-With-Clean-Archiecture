import { type AccountSetPromptUseCaseConstructor } from "@/application/port/in/account-set-prompt-use-case";
import type { Account } from "../model/account";
import { createEmptyAccount } from "../model/account";

const AccountSetPromptUseCaseConstructor: AccountSetPromptUseCaseConstructor =
  (loadAccount, saveAccount) => async (discordAccount, prompt) => {
    const account = await loadAccount(discordAccount.accountId);
    const updatedAccount: Account = {
      ...createEmptyAccount(
        discordAccount.accountId,
        discordAccount.username
      ),
      ...account,
      prompt,
    };
    await saveAccount(updatedAccount);
    return updatedAccount;
  };

export default AccountSetPromptUseCaseConstructor;
