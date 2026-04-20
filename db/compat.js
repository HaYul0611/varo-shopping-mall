// db/compat.js
'use strict';
const { Database: RawDatabase } = require('node-sqlite3-wasm');
const path = require('path');
const fs = require('fs');

class Statement {
  constructor(rawStmt) { this._stmt = rawStmt; }
  run(...args) {
    const v = args.length===1 && Array.isArray(args[0]) ? args[0] : args;
    return this._stmt.run(v);
  }
  get(...args) {
    const v = args.length===1 && Array.isArray(args[0]) ? args[0] : args.length>0 ? args : undefined;
    return this._stmt.get(v);
  }
  all(...args) {
    const v = args.length===1 && Array.isArray(args[0]) ? args[0] : args.length>0 ? args : undefined;
    return this._stmt.all(v);
  }
}

class Database {
  constructor(dbPath) {
    const lockDir = dbPath + '.lock';
    if (fs.existsSync(lockDir)) { try { fs.rmdirSync(lockDir); } catch(e){} }
    this._db = new RawDatabase(dbPath);
    try { this._db.exec("PRAGMA foreign_keys = ON"); } catch(e){}
  }
  pragma() { return this; }
  exec(sql) { return this._db.exec(sql); }
  prepare(sql) { return new Statement(this._db.prepare(sql)); }
  run(sql, ...args) { return this.prepare(sql).run(...args); }
  get(sql, ...args) { return this.prepare(sql).get(...args); }
  all(sql, ...args) { return this.prepare(sql).all(...args); }
}
module.exports = Database;
