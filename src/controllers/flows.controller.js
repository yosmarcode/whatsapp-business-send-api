const { env } = require("../config/env");
const { sendFlow } = require("../services/whatsapp.service");

async function sendFlowEndpoint(req, res) {
  try {
    const { to, flowId, flowCta, screen, flowToken } = req.body || {};

    const resolvedTo = to;
    const resolvedFlowId = flowId || env.WHATSAPP_DEFAULT_FLOW_ID;
    const resolvedFlowCta = flowCta || env.WHATSAPP_DEFAULT_FLOW_CTA;
    const resolvedScreen = screen || env.WHATSAPP_DEFAULT_FLOW_SCREEN;

    if (!resolvedTo) return res.status(400).json({ error: "Missing 'to'" });
    if (!resolvedFlowId) return res.status(400).json({ error: "Missing 'flowId' (or WHATSAPP_DEFAULT_FLOW_ID)" });
    if (!resolvedFlowCta) return res.status(400).json({ error: "Missing 'flowCta' (or WHATSAPP_DEFAULT_FLOW_CTA)" });

    const result = await sendFlow({
      to: resolvedTo,
      flowId: resolvedFlowId,
      flowCta: resolvedFlowCta,
      screen: resolvedScreen,
      flowToken
    });

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error("Error sending flow:", err?.response?.data || err);
    return res.status(500).json({ ok: false, error: "Failed to send flow" });
  }
}

module.exports = { sendFlowEndpoint };
