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
     * 
     * @param {*} keys: could be only one value, or an array of values
     * @param {*} callback 
     */
    get(keys, callback) {
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
                const sql = "select * from " + this.tableName + " where "
                + this.primaryKey.map(element => element + " = ?").join(" and ")
                + " limit 1";
                if (!Array.isArray(keys)){
                    keys = [keys];
                }
                connection.query(sql, keys, (err, entity, fields) => {
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
                        let dict = {};
                        Object.keys(entity[0]).forEach((attr) => {
                            dict[attr] = entity[0][attr];
                        });
                        callback(null, new Entity[this.tableName](dict));
                    }
                    this.pool.end();
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
    user: User, friend: Friend, question: Question, answer: Answer
};