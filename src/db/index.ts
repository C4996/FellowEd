import Datastore from "@seald-io/nedb";
import { UserInfo } from "../schema/userInfo";
import { FileInfo } from "../schema/fileInfo";
const db = new Map<string, Datastore>();
function getTable<T>(name: string) {
  let table = db.get(name);
  if (!table) {
    table = new Datastore<T>();
    db.set(name, table);
  }
  return table as Datastore<T>;
}

export default {
  user: getTable<UserInfo>("user"),
  file: getTable<FileInfo>("file"),
};
