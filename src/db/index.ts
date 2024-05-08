// import Datastore from "@seald-io/nedb";
import NeDB = require("@seald-io/nedb");
const Datastore = NeDB.Nedb.DataStore;
type DataStore<T> = NeDB.Nedb.DataStore<T>;
import { UserInfo } from "../schema/userInfo";
import { FileInfo } from "../schema/fileInfo";
const db = new Map<string, DataStore<any>>();
function getTable<T>(name: string) {
  let table = db.get(name);
  if (!table) {
    table = new Datastore<T>();
    db.set(name, table);
  }
  return table as DataStore<T>;
}

export default {
  user: getTable<UserInfo>("user"),
  file: getTable<FileInfo>("file"),
};
