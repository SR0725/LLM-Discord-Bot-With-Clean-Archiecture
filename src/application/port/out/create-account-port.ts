import { type Account } from "@/application/domain/model/account";

export interface CreateAccountPort {
  (account: Account): Promise<void>;
}
