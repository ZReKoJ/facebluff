"use strict"

// private libs
const config = require("../../../config");
const messages = require("../messages");
const {
    Strings
} = require("../utils");
const Entity = require("./entity");

/**
 * Generic DAO class where any other extends from
 */
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
                    });
                }
            });
        }
    }

    /**
     * select all
     * @param {*} callback: if nothing is found then pass an array with 0 elements
     */
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
                });
            }
        });
    }

    /**
     * insert one entity to table in database
     * @param {*} entity: a dict containing the entity
     * @param {*} callback: if success returns the entity with its id
     */
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
                });
            }
        });
    }

    insertMany(arrayEntity, callback) {
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
                let delimiter = ',';
                let columns = this.tableColumns.filter(element => element != 'id');
                let sql = "insert into " + this.tableName + " (" + columns.join(delimiter) + ") values ";
                let questionmarks = new Array(columns.length).fill('?');
                let array_questionmarks = new Array(arrayEntity.length).fill("(" + questionmarks.join(delimiter) + ")");
                sql = sql + array_questionmarks.join(delimiter);
                let attr = arrayEntity.map((element) => Object.keys(element).filter((keys) => this.tableColumns.indexOf(keys) != -1).map((keys) => element[keys]));
                attr = attr.flat();
                connection.query(sql, attr, (err, result) => {
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
                        callback(null, result.affectedRows);
                    }
                });

            }
        });
    }

    /**
     * update one entity
     * @param {*} check: a dictionary containing the where parameters
     * @param {*} change: a dictionary containing the set parameters
     * @param {*} callback: returns true if success else false
     */
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
                            callback(null, result.affectedRows > 0 ? true : false);
                        }
                    });
            }
        });
    }

    /**
     * delete one entity
     * @param {*} entity: a dictionary containing the data of the entity
     * @param {*} callback: returns true if success else false
     */
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
                        callback(null, result.affectedRows > 0 ? true : false);
                    }
                });
            }
        });
    }

    /**
     * find one element by any tag passed by dict
     * @param {*} dict: a dictionary containing where parameters
     * @param {*} callback: returns the entity found, if not found null
     */
    findBy(dict, callback, limit = undefined) {
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
                let sql = "select * from " + this.tableName + " where " +
                    Object.keys(dict).map(element => element + " = ?").join(" and ") +
                    (limit != undefined ? " limit " + limit : "");
                connection.query(sql, Object.keys(dict).map(element => dict[element]), (err, result) => {
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
                        callback(null, result);
                    }
                });
            }
        });
    }
    in(dict,callback){
        this.pool.getConnection((err, connection) =>{
            if(err){
                callback(
                    new Error(
                        Strings.transform(
                            messages[config.locale].databaseConnectionError, {
                                "errorMessage": err.message
                            }
                        )));
            
            }
            else{
                let sql = "select * from " + this.tableName + " where " + 
                Object.keys(dict).map(element => element + " IN (" + 
                dict[element].map(element => "?").join(',') + ')').join(" and ");
                connection.query(sql, Object.keys(dict).map(element => dict[element]).flat(), (err, result) => {
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
                        callback(null, result);
                    }
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

    /**
     * finds one element by email
     * @param {*} email: email passed
     * @param {*} callback: returns the entity found, if not found null
     */
    findByEmail(email, callback) {
        this.findBy({
            email: email
        }, (err, result) => {
            if (err) {
                callback(err, null);
            }
            else {
                callback(err, result[0]);
            }
        }, 1);
    }
}

class Friend extends DAO {
    constructor(_pool) {
        super(_pool,
            config.dbTables.friend.name,
            config.dbTables.friend.primaryKey,
            config.dbTables.friend.tableColumns);
    }
    findFriends(id, callback) {
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
                let sql = "select * from " + this.tableName + " where (friendid=? or otherfriendid=?)"
                connection.query(sql, [id,id], (err, result) => {
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
                        callback(null, result);
                    }
                });
            }
        });
    }


}


class Question extends DAO {
    constructor(_pool) {
        super(_pool,
            config.dbTables.question.name,
            config.dbTables.question.primaryKey,
            config.dbTables.question.tableColumns);
    }
}

class Answer extends DAO {
    constructor(_pool) {
        super(_pool,
            config.dbTables.answer.name,
            config.dbTables.answer.primaryKey,
            config.dbTables.answer.tableColumns);
    }
}

module.exports = {
    user: User,
    friend: Friend,
    question: Question,
    answer: Answer
};