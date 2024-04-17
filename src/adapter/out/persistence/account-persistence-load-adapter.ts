import type { LoadAccountPort } from "@/application/port/out/load-account-port";
import type { MongoCollections } from "./mongo-db";

const AccountPersistenceLoadAdapter =
  ({ accountCollection }: MongoCollections): LoadAccountPort =>
  async (accountId) => {
    const account = await accountCollection.findOne({
      accountId: accountId,
    });
    return account;
  };

export default AccountPersistenceLoadAdapter;
