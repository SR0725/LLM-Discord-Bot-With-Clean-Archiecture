import { type Account } from "@/application/domain/model/account";
import { type LoadAccountPort } from "../out/load-account-port";
import { type UpdateAccountPort } from "../out/update-account-port";

export interface AccountSwitchModelUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    updateAccount: UpdateAccountPort
  ): AccountSwitchModelUseCase;
}

export interface AccountSwitchModelUseCase {
  (accountId: string, model: string): Promise<Account>;
}
