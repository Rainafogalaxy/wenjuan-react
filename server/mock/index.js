const test = require("./test");
const question = require("./question");
const user = require("./user");
const stat = require("./stat");

// 将所有汇总
const mockList = [...test, ...question, ...user, ...stat];

module.exports = mockList;
