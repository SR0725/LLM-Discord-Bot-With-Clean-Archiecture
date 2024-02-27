import { type Account } from "@/application/domain/model/account";

export interface UpdateAccountPort {
  (account: Account): Promise<void>;
}
