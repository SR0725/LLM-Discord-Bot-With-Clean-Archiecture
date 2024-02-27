import { type Account } from "@/application/domain/model/account";
import { type LoadAccountPort } from "../out/load-account-port";
import { type UpdateAccountPort } from "../out/update-account-port";
import { type CreateAccountPort } from "../out/create-account-port";

export interface AccountSwitchModelUseCaseConstructor {
  (
    createAccount: CreateAccountPort,
    loadAccount: LoadAccountPort,
    updateAccount: UpdateAccountPort
  ): AccountSwitchModelUseCase;
}

export interface AccountSwitchModelUseCase {
  (accountId: string, model: string): Promise<Account>;
}
