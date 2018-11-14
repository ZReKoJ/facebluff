"use strict"

const config = require("../../../config.json");
const messages = require("../messages");
const {
    Strings
} = require("../utils");
const Entity = require("./entity");

class DAO {
    constructor(_pool, _tableName, _primaryKey, _tableColumns) {
        this.pool = _pool;
        this.tableName = _tableName;
        this.primaryKey = _primaryKey;
        this.tableColumns = _tableColumns;
    }

    /**
     * get by id
     * @param {*} keys: could be only one value, or an array of values
     * @param {*} callback: if nothing is found then pass a null value
     */
    get(keys, callback) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        if (keys.length != this.primaryKey.length) {
            callback(
                new Error(
                    Strings.transform(
                        messages[config.locale].parametersError
                    )));
        } else {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    callback(
                        new Error(
                            Strings.transform(
                                messages[config.locale].databaseConnectionError, {
                                    "errorMessage": err.message
                                }
                            )));
                } else {
                    const sql = "select * from " + this.tableName +
                        " where " + this.primaryKey.map(element => element + " = ?").join(" and ") +
                        " limit 1";
                    connection.query(sql, keys, (err, result) => {
                        connection.release();
                        if (err) {
                            callback(
                                new Error(
                                    Strings.transform(
                                        messages[config.locale].sqlQueryError, {
                                            "sql": sql,
                                            "errorMessage": err.message
                                        }
                                    )));
                        } else {
                            if (result.length > 0) {
                                callback(null, new Entity[this.tableName](result[0]));
                            } else callback(null, null);
                        }
                        this.pool.end();
                    });
                }
            });
        }
    }

    selectAll(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(
                    new Error(
                        Strings.transform(
                            messages[config.locale].databaseConnectionError, {
                                "errorMessage": err.message
                            }
                        )));
            } else {
                const sql = "select * from " + this.tableName;
                connection.query(sql, (err, result) => {
                    connection.release();
                    if (err) {
                        callback(
                            new Error(
                                Strings.transform(
                                    messages[config.locale].sqlQueryError, {
                                        "sql": sql,
                                        "errorMessage": err.message
                                    }
                                )));
                    } else {
                        callback(null, result.map(element => new Entity[this.tableName](element)));
                    }
                    this.pool.end();
                });
            }
        });
    }

    insert(entity, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(
                    new Error(
                        Strings.transform(
                            messages[config.locale].databaseConnectionError, {
                                "errorMessage": err.message
                            }
                        )));
            } else {
                let attr = Object.keys(entity).filter(element => this.tableColumns.indexOf(element) != -1);
                let sql = "insert into " + this.tableName +
                    " (" + attr.join(", ") + ")" +
                    " values" +
                    " (" + attr.map(element => "?").join(", ") + ")";
                connection.query(sql, attr.map(element => entity[element]), (err, result) => {
                    connection.release();
                    if (err) {
                        callback(
                            new Error(
                                Strings.transform(
                                    messages[config.locale].sqlQueryError, {
                                        "sql": sql,
                                        "errorMessage": err.message
                                    }
                                )));
                    } else {
                        let resultEntity = entity;
                        if (this.primaryKey.length == 1) {
                            this.primaryKey.forEach(element => {
                                resultEntity[element] = result.insertId;
                            });
                        }
                        callback(null, resultEntity);
                    }
                    this.pool.end();
                });
            }
        });
    }

    update(check, change, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(
                    new Error(
                        Strings.transform(
                            messages[config.locale].databaseConnectionError, {
                                "errorMessage": err.message
                            }
                        )));
            } else {
                let sql = "update " + this.tableName +
                    " set " + Object.keys(change).map(element => element + " = ?").join(", ") +
                    " where " + Object.keys(check).map(element => element + " = ?").join(" and ");
                connection.query(sql,
                    Object.keys(change).map(element => change[element])
                    .concat(Object.keys(check).map(element => check[element])),
                    (err, result) => {
                        connection.release();
                        if (err) {
                            callback(
                                new Error(
                                    Strings.transform(
                                        messages[config.locale].sqlQueryError, {
                                            "sql": sql,
                                            "errorMessage": err.message
                                        }
                                    )));
                        } else {
                            callback(null, null);
                        }
                        this.pool.end();
                    });
            }
        });
    }

    delete(entity, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(
                    new Error(
                        Strings.transform(
                            messages[config.locale].databaseConnectionError, {
                                "errorMessage": err.message
                            }
                        )));
            } else {
                let sql = "delete from " + this.tableName + " where " +
                    Object.keys(entity).map(element => element + " = ?").join(" and ");
                connection.query(sql, Object.keys(entity).map(element => entity[element]), (err, result) => {
                    connection.release();
                    if (err) {
                        callback(
                            new Error(
                                Strings.transform(
                                    messages[config.locale].sqlQueryError, {
                                        "sql": sql,
                                        "errorMessage": err.message
                                    }
                                )));
                    } else {
                        callback(null, null);
                    }
                    this.pool.end();
                });
            }
        });
    }
}

class User extends DAO {
    constructor(_pool) {
        super(_pool,
            config.dbTables.user.name,
            config.dbTables.user.primaryKey,
            config.dbTables.user.tableColumns);
    }
}

class Friend extends DAO {
    constructor(_pool) {
        super(_pool,
            config.dbTables.user.name,
            config.dbTables.user.primaryKey,
            config.dbTables.user.tableColumns);
    }
}

class Question extends DAO {
    constructor(_pool) {
        super(_pool,
            config.dbTables.user.name,
            config.dbTables.user.primaryKey,
            config.dbTables.user.tableColumns);
    }
}

class Answer extends DAO {
    constructor(_pool) {
        super(_pool,
            config.dbTables.user.name,
            config.dbTables.user.primaryKey,
            config.dbTables.user.tableColumns);
    }
}

module.exports = {
    user: User,
    friend: Friend,
    question: Question,
    answer: Answer
};