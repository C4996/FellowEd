import { Nedb } from "@seald-io/nedb";
import { UserInfo } from "../schema/userInfo.js";
import { FileInfo } from "../schema/fileInfo.js";

const db = new Map<string, Nedb.DataStore>();
function getTable<T>(name: string) {
  let table = db.get(name);
  if (!table) {
    table = new Nedb.DataStore<T>();
    db.set(name, table);
  }
  return table as Nedb.DataStore<T>;
}

export default {
  user: getTable<UserInfo>("user"),
  file: getTable<FileInfo>("file"),
};
