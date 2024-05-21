const db = require("better-sqlite3")("foobar.db", {});

export class User {
  constructor() {
    this.createTable();
  }
  createTable() {}

  get() {}

  insert() {}
}
