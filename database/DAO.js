"use strict"

class DAO {
    constructor(_pool, _tableName, _primaryKey) {
        this.pool = _pool;
        this.tableName = _tableName;
        this.primaryKey = _primaryKey;
    }

    get(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("e"));
            }
            else {
                const sql = "select * from " + this.tableName + " where " + this.primaryKey + "=?";
                connection.query(sql, [id], (err, entity) => {
                    connection.release();
                    if (err) {
                        callback(new Error(err.message));
                    }
                    else {
                        callback(null, entity);
                    }
                });
            }
        });
    }
}

module.exports = DAO;