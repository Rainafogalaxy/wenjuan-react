const test = require("./test");
const question = require("./question");
const user = require("./user");

// 将所有汇总
const mockList = [...test, ...question, ...user];

module.exports = mockList;
