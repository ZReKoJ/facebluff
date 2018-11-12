"use strict"

const config = require("../config");
const messages = require("../messages");
const {
    Strings
} = require("../utils");
const Entity = require("./entity");

class DAO {
    constructor(_pool, _tableName, _primaryKey) {
        this.pool = _pool;
        this.tableName = _tableName;
        this.primaryKey = _primaryKey;
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
                        messages[config.language].parametersError
                    )));
        }
        else {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    callback(
                        new Error(
                            Strings.transform(
                                messages[config.language].databaseConnectionError, {
                                    "errorMessage": err.message
                                }
                            )));
                } else {
                    const sql = "select * from " + this.tableName + " where " +
                        this.primaryKey.map(element => element + " = ?").join(" and ") +
                        " limit 1";
                    connection.query(sql, keys, (err, result) => {
                        connection.release();
                        if (err) {
                            callback(
                                new Error(
                                    Strings.transform(
                                        messages[config.language].sqlQueryError, {
                                            "sql": sql,
                                            "errorMessage": err.message
                                        }
                                    )));
                        } else {
                            if (result.length > 0) {
                                callback(null, new Entity[this.tableName](result[0]));
                            }
                            else callback(null, null);
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
                            messages[config.language].databaseConnectionError, {
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
                                    messages[config.language].sqlQueryError, {
                                        "sql": sql,
                                        "errorMessage": err.message
                                    }
                                )));
                    } else {
                        callback(null, result.map(element => new Entity[this.tableName](element)));
                    }
                });
            }
        });
    }
}

class User extends DAO {
    constructor(_pool) {
        super(_pool, config.tables.user.name, config.tables.user.primaryKey);
        this.tableColumns = config.tables.user.tableColumns;
    }
}

class Friend extends DAO {
    constructor(_pool) {
        super(_pool, config.tables.friend.name, config.tables.friend.primaryKey);
        this.tableColumns = config.tables.friend.tableColumns;
    }
}

class Question extends DAO {
    constructor(_pool) {
        super(_pool, config.tables.question.name, config.tables.question.primaryKey);
        this.tableColumns = config.tables.question.tableColumns;
    }
}

class Answer extends DAO {
    constructor(_pool) {
        super(_pool, config.tables.answer.name, config.tables.answer.primaryKey);
        this.tableColumns = config.tables.answer.tableColumns;
    }
}

module.exports = {
    user: User,
    friend: Friend,
    question: Question,
    answer: Answer
};