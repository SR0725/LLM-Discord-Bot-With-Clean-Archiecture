import { Account } from "@/application/domain/model/account";

export interface AccountSwitchModelUseCase {
  switchModel(accountId: string, model: string): Promise<Account>;
}
