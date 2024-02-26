import { Account } from "@/application/domain/model/account";

export interface LoadAccountPort {
  loadAccount(accountId: string): Promise<Account>;
}
