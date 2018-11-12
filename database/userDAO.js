"use strict"

const config = require("./config");
const DAO = require("./DAO");

class UserDAO extends DAO {
    constructor(_pool) {
        super(_pool, config.tables.user.name, config.tables.user.primaryKey);
        this.tableColumns = config.tables.user.tableColumns;
    }
}

module.exports = UserDAO;