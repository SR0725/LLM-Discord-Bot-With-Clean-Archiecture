import { type Account } from "@/application/domain/model/account";

export type LoadAccountPort = (accountId: string) => Promise<Account>;
