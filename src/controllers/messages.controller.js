const {
  sendInteractiveButtons2,
  sendInteractiveButtons,
  sendTextMessage
} = require("../services/whatsapp.service");

async function sendMessageEndpoint2Controller(req, res) {
  try {
    const payload = req.body;

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ error: "Missing JSON body" });
    }

    if (!payload.messaging_product) {
      return res.status(400).json({ error: "Missing 'messaging_product'" });
    }
    if (!payload.to) {
      return res.status(400).json({ error: "Missing 'to'" });
    }
    if (!payload.type) {
      return res.status(400).json({ error: "Missing 'type'" });
    }

    const result = await sendInteractiveButtons2(payload);
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data;

    console.error("Error sending message:", data || err);

    return res.status(status).json({
      ok: false,
      error: "Failed to send message",
      details: data || err?.message || String(err)
    });
  }
}

async function sendMessageEndpointInteractiveController(
  req,
  res
) {
  try {
    const { to, bodyText, footerText, button1, button2, imageLink } = req.body;

    if (!to || typeof to !== "string") {
      return res.status(400).json({ error: "Missing 'to'" });
    }

    if (!bodyText || typeof bodyText !== "string") {
      return res.status(400).json({ error: "Missing 'bodyText'" });
    }

    if (!button1?.id || !button1?.title) {
      return res.status(400).json({ error: "Missing 'button1.id' or 'button1.title'" });
    }

    if (!button2?.id || !button2?.title) {
      return res.status(400).json({ error: "Missing 'button2.id' or 'button2.title'" });
    }

    const result = await sendInteractiveButtons({
      to,
      bodyText,
      footerText,
      button1,
      button2,
      imageLink
    });

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data;

    console.error("Error sending message:", data || err);

    return res.status(status).json({
      ok: false,
      error: "Failed to send message",
      details: data || err?.message || String(err)
    });
  }
}

async function sendTextEndpoint(req, res) {
  try {
    const { to, text } = req.body || {};

    if (!to || typeof to !== "string") {
      return res.status(400).json({ error: "Missing 'to'" });
    }
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text'" });
    }

    const result = await sendTextMessage({ to, text });
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data;

    console.error("Error sending text:", data || err);

    return res.status(status).json({
      ok: false,
      error: "Failed to send text",
      details: data || err?.message || String(err)
    });
  }
}

module.exports = {
  sendMessageEndpoint2Controller,
  sendMessageEndpointInteractiveController,
  sendTextEndpoint
};
