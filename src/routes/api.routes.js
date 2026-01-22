const express = require("express");
const { sendFlowEndpoint } = require("../controllers/flows.controller");
const { sendMessageEndpoint2Controller, sendMessageEndpointInteractiveController } = require("../controllers/messages.controller");

const router = express.Router();

router.post("/flows/send", sendFlowEndpoint);
router.post("/messages", sendMessageEndpoint2Controller);
router.post("/messages/send/interactive", sendMessageEndpointInteractiveController);

module.exports = router;
