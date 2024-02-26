import { Account } from "@/application/domain/model/account";
import { AccountSwitchModelUseCase } from "@/application/port/in/account-switch-model-use-case";
import { LoadAccountPort } from "@/application/port/out/load-account-port";
import { UpdateAccountPort } from "@/application/port/out/update-account-port";

export class AccountSwitchModelService implements AccountSwitchModelUseCase {
  constructor(
    private readonly loadAccountPort: LoadAccountPort,
    private readonly updateAccountPort: UpdateAccountPort
  ) {}

  async switchModel(accountId: string, model: string): Promise<Account> {
    const account = await this.loadAccountPort.loadAccount(accountId);
    account.usedModel = model;
    await this.updateAccountPort.updateAccount(account);
    return account;
  }
}
