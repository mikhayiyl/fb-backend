const morgan = require("morgan");
const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const posts = require("../routes/posts");
const savedPosts = require("../routes/savedPosts");
const comments = require("../routes/comments");
const uploads = require("../routes/uploads");
const conversations = require("../routes/conversations");
const messages = require("../routes/messages");
const messengers = require("../routes/messengers");
const ratings = require("../routes/ratings");
const sharedPosts = require("../routes/sharedPosts");
const notifications = require("../routes/notifications");
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/posts", posts);
  app.use("/api/savepost", savedPosts);
  app.use("/api/sharepost", sharedPosts);
  app.use("/api/uploads", uploads);
  app.use("/api/comments", comments);
  app.use("/api/messages", messages);
  app.use("/api/messengers", messengers);
  app.use("/api/notifications", notifications);
  app.use("/api/ratings", ratings);
  app.use("/api/conversations", conversations);
  app.use(error);
}