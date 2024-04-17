import { Account } from "@/application/domain/model/account";
import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";

export interface MongoCollections {
  accountCollection: Collection<Account>;
}

async function createMongoClientCollection(): Promise<MongoCollections> {
  const connectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("MONGODB_CONNECTION_STRING is not set");
  }

  const client = await MongoClient.connect(connectionString);

  const db = client.db("ray-realms-bot");
  const accountCollection = db.collection<Account>("account");

  return {
    accountCollection,
  };
}
export default createMongoClientCollection;
