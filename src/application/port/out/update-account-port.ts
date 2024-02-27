import { type Account } from "@/application/domain/model/account";

export type UpdateAccountPort = (account: Account) => Promise<void>
