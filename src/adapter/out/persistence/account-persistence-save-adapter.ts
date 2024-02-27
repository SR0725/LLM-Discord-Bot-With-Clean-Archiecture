import { Account } from "@/application/domain/model/account";
import { SaveAccountPort } from "@/application/port/out/save-account-port";
import fs from "fs";

const AccountPersistenceSaveAdapter: SaveAccountPort = async (
  account: Account
) => {
  const dataPath = `./data/account/${account.accountId}.json`;
  // 檢查資料夾是否存在
  if (!fs.existsSync("./data/account")) {
    fs.mkdirSync("./data/account", { recursive: true });
  }
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(account, null, 2), "utf8");
};

export default AccountPersistenceSaveAdapter;
