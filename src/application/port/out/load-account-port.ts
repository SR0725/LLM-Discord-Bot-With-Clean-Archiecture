import { type Account } from "@/application/domain/model/account";

export interface LoadAccountPort {
  (accountId: string): Promise<Account | null>;
}
