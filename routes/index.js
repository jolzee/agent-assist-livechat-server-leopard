/*jslint node: true, nomen: true*/
"use strict";

var express = require("express");
var router = express.Router();
// var logger = require("./../logger");

var LiveChatApi = require("livechatapi").LiveChatApi;
var api = new LiveChatApi(process.env.USER, process.env.LIVE_CHAT_API_KEY);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({
    message: "Live Chat Server Setup",
  });
});

router.get("/ping", function (req, res, next) {
  res.send({
    message: "pong",
  });
});

router.post("/can", function (req, res) {
  //   logger.info(req.body);
  api.canned_responses.create(req.body, function (data) {
    res.send({ result: "OK" });
  });
});

module.exports = router;
