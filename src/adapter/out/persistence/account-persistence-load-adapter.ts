import { LoadAccountPort } from "@/application/port/out/load-account-port";
import fs from "fs";

const AccountPersistenceLoadAdapter: LoadAccountPort = async (
  accountId: string
) => {
  const dataPath = `./data/account/${accountId}.json`;
  // 判斷檔案是否存在
  if (!fs.existsSync(dataPath)) {
    throw new Error("Account not found");
  }
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
};
