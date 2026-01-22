const axios = require("axios");
const crypto = require("crypto");

const { env } = require("../config/env");

function getGraphBaseUrl() {
  return `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}`;
}

function requireWhatsAppConfig() {
  if (!env.WHATSAPP_ACCESS_TOKEN) throw new Error("Missing env var: WHATSAPP_ACCESS_TOKEN");
  if (!env.WHATSAPP_PHONE_NUMBER_ID) throw new Error("Missing env var: WHATSAPP_PHONE_NUMBER_ID");
}

async function sendWhatsAppMessage(payload) {
  requireWhatsAppConfig();

  const url = `${getGraphBaseUrl()}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const resp = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  return resp.data;
}

function generateFlowToken() {
  return crypto.randomUUID();
}

async function sendFlow({ to, flowId, flowCta, screen = "START", flowToken }) {
  const resolvedFlowToken = flowToken || generateFlowToken();

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "flow",
      body: {
        text: "Para continuar con el agendamiento, presiona el botón."
      },
      action: {
        name: "flow",
        parameters: {
          flow_message_version: "3",
          flow_id: flowId,
          flow_token: resolvedFlowToken,
          flow_cta: flowCta,
          flow_action: "navigate",
          flow_action_payload: {
            screen
          }
        }
      }
    }
  };

  return sendWhatsAppMessage(payload);
}

async function sendTextMessage({ to, text }) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: {
      body: text
    }
  };

  return sendWhatsAppMessage(payload);
}

async function sendInteractiveButtons2(payload) {
  return sendWhatsAppMessage(payload);
}

async function sendInteractiveButtons({
  to,
  bodyText,
  footerText,
  button1,
  button2,
  imageLink
}) {
  const resolvedFooterText =
    typeof footerText === "string" && footerText.length > 60 ? footerText.slice(0, 60) : footerText;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      header: imageLink
        ? {
            type: "image",
            image: { link: imageLink }
          }
        : undefined,
      body: { text: bodyText },
      footer: resolvedFooterText ? { text: resolvedFooterText } : undefined,
      action: {
        buttons: [
          { type: "reply", reply: { id: button1.id, title: button1.title } },
          { type: "reply", reply: { id: button2.id, title: button2.title } }
        ]
      }
    }
  };

  if (!payload.interactive.header) {
    delete payload.interactive.header;
  }
  if (!payload.interactive.footer) {
    delete payload.interactive.footer;
  }

  return sendWhatsAppMessage(payload);
}

module.exports = {
  sendFlow,
  sendInteractiveButtons,
  sendInteractiveButtons2,
  sendTextMessage,
  sendWhatsAppMessage,
  generateFlowToken
};
