import { Account } from "@/application/domain/model/account";

export interface UpdateAccountPort {
  updateAccount(account: Account): Promise<void>;
}
