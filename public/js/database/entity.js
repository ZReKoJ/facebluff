"use strict"

// private libs
const config = require("../../../config");

/**
 * Generic Entity class where any other entities extends from
 */
class Entity {
    constructor(_params, _dict) {
        this.params = _params;
        this.set(_dict);
    }

    set(_dict) {
        this.params.forEach((key) => {
            if (_dict.hasOwnProperty(key)) {
                this[key] = _dict[key];
            }
        });
    }
}

class User extends Entity {
    constructor(_dict) {
        super(config.dbTables.user.tableColumns, _dict);
    }
}

class Friend extends Entity {
    constructor(_dict) {
        super(config.dbTables.friend.tableColumns, _dict);
    }
}

class Question extends Entity {
    constructor(_dict) {
        super(config.dbTables.question.tableColumns, _dict);
    }
}

class Answer extends Entity {
    constructor(_dict) {
        super(config.dbTables.answer.tableColumns, _dict);
    }
}

class QuestionAnswered extends Entity {
    constructor(_dict) {
        super(config.dbTables.questionanswered.tableColumns, _dict);
    }
}

module.exports = {
    user: User,
    friend: Friend,
    question: Question,
    answer: Answer,
    questionanswered: QuestionAnswered
};