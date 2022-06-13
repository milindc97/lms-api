const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");
db.questionBank = require("./questionBank.model");
db.question = require("./question.model");
db.module = require("./module.model");
db.course = require("./courses.model");
db.program = require("./program.model");
db.programAllocation = require("./programAllocation.model");
db.audit = require("./audit.model");
db.notification = require("./notification.model");
db.quizScore = require("./quizScore.model");
db.modulesWatch = require("./modulesWatch.model");
db.userRequests = require("./userRequests.model");
db.notificationTrans = require("./notificationTrans.model");
db.support = require("./support.model");
db.policy = require("./policy.model");
db.certificate = require("./certificates.model");
db.config = require("./config.model");
db.supporttransaction = require("./supportTransaction.model");
db.post = require("./post.model");
db.postlikes = require("./postlikes.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;