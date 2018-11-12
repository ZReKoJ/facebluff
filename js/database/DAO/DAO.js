"use strict"

const config = require("./../../config");
const messages = require("./../../messages");
const {
    Strings
} = require("./../../utils");

class DAO {
    constructor(_pool, _tableName, _primaryKey) {
        this.pool = _pool;
        this.tableName = _tableName;
        this.primaryKey = _primaryKey;
    }

    get(id, callback) {
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
                const sql = "select * from " + this.tableName + " where " + this.primaryKey + " = ? limit 1";
                connection.query(sql, [id], (err, entity) => {
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
                        
                        callback(null, entity);
                    }
                });
            }
        });
    }
}

module.exports = DAO;