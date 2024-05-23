const db = require("better-sqlite3")("foobar.db", {});

export class User {
  constructor() {
    this.createTable();
  }
  createTable() {
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='user';").get();  
  
    if (!tableExists) {  

      db.prepare("CREATE TABLE user (" +  
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +  
        "username TEXT NOT NULL UNIQUE, " +  
        "password TEXT NOT NULL, " +  
        "email TEXT UNIQUE" +  
      ")").run();  
  
      console.log("User table created.");  
    } 
  }

  get(userId) {
    const user = db.prepare("SELECT * FROM user WHERE id = ?").get(userId);  
    return user; 
  }

  getAllUsers() {  
    const users = db.prepare("SELECT * FROM user").all();  
    return users;  
  }

  insert(username, password, email) {
    try {  
      db.prepare("INSERT INTO user (username, password, email) VALUES (?, ?, ?)")  
        .run(username, password, email);  
  
      return db.lastID;  
    } catch (error) {  
      
      console.error('Error inserting user:', error);
      return { success: false, message: error.message };  
    }  
  }
}