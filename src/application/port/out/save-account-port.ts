import { type Account } from "@/application/domain/model/account";

export interface SaveAccountPort {
  (account: Account): Promise<void>;
}
