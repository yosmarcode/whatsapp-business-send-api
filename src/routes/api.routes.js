const express = require("express");
const { sendFlowEndpoint } = require("../controllers/flows.controller");
const {
  sendMessageEndpoint2Controller,
  sendMessageEndpointInteractiveController,
  sendTextEndpoint
} = require("../controllers/messages.controller");

const router = express.Router();

router.post("/flows/send", sendFlowEndpoint);
router.post("/messages", sendMessageEndpoint2Controller);
router.post("/messages/send/interactive", sendMessageEndpointInteractiveController);
router.post("/messages/text", sendTextEndpoint);

module.exports = router;
