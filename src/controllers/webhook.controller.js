const { env } = require("../config/env");
const {
  sendInteractiveButtons,
  sendFlow,
  sendTextMessage
} = require("../services/whatsapp.service");

function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

async function receiveWebhook(req, res) {
  const body = req.body;
  console.log("🚀 ~ receiveWebhook ~ body:", body);

  if (body?.object !== "whatsapp_business_account") {
    return res.sendStatus(404);
  }

  try {
    for (const entry of body.entry || []) {
      const value = entry?.changes?.[0]?.value;
      if (!value) continue;

      if (value.messages?.length) {
        const message = value.messages[0];
        const from = message.from;
        const name = value.contacts?.[0]?.profile?.name || from;

        if (message.type === "interactive" && message.interactive?.type === "n_flow_reply") {
          const json = message.interactive?.n_flow_reply?.response_json;
          if (json) {
            const flowData = JSON.parse(json);
            console.log(`\n[FLOW] Datos recibidos de ${name} (${from}):`);
            console.log(JSON.stringify(flowData, null, 2));
          }
        } else if (message.type === "text") {
          console.log(`\n[MENSAJE] De ${name} (${from}): ${message.text?.body || ""}`);

          const bodyText =
            "Bienvenido al sistema de agendamiento.\n\nPara continuar, completa el siguiente formulario para agendar tu recepción o despacho.\n\nInformación que necesitarás:\n- Fecha y hora de llegada\n- Tipo y cantidades de camiones\n- Información de bins\n- Variedad de fruta";
          const footerText =
            "Todos campos son necesarios";

          sendInteractiveButtons({
            to: from,
            bodyText,
            footerText,
            imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8V1W1dbt4dK9TadXuQDEMix3NwUeBLy0jww&s",
            button1: { id: "comenzar", title: "Comenzar Agendamiento" },
            button2: { id: "hablar_asesor", title: "Hablar con un asesor" }
          })
            .then((result) => {
              console.log("[AUTO-REPLY] Mensaje interactivo enviado:", result);
            })
            .catch((err) => {
            console.error("Error enviando auto-reply:", err?.response?.data || err);
          });
        } else if (message.type === "interactive" && message.interactive?.type === "button_reply") {
          const buttonId = message.interactive?.button_reply?.id;
          console.log(`\n[INTERACTIVE] Button reply de ${name} (${from}): ${buttonId}`);

          if (buttonId === "comenzar") {
            if (!env.WHATSAPP_DEFAULT_FLOW_ID) {
              sendTextMessage({
                to: from,
                text: "El formulario aún no está configurado. Intenta nuevamente más tarde."
              }).catch((err) => {
                console.error("Error enviando fallback text:", err?.response?.data || err);
              });
            } else {
              sendFlow({
                to: from,
                flowId: env.WHATSAPP_DEFAULT_FLOW_ID,
                flowCta: env.WHATSAPP_DEFAULT_FLOW_CTA,
                screen: env.WHATSAPP_DEFAULT_FLOW_SCREEN
              })
                .then((result) => {
                  console.log("[FLOW-SEND] Flow enviado:", result);
                })
                .catch((err) => {
                  console.error("Error enviando Flow:", err?.response?.data || err);

                  sendTextMessage({
                    to: from,
                    text: "No pude iniciar el formulario en este momento. Intenta nuevamente más tarde."
                  }).catch((err2) => {
                    console.error("Error enviando fallback text:", err2?.response?.data || err2);
                  });
                });
            }
          }
        } else {
          console.log(`\n[EVENTO] Tipo: ${message.type} de ${from}`);
        }
      }

      if (value.statuses?.length) {
        const status = value.statuses[0];
        const recipient = status.recipient_id;

        let estadoTexto = "";
        if (status.status === "sent") estadoTexto = "Enviado";
        if (status.status === "delivered") estadoTexto = "Entregado";
        if (status.status === "read") estadoTexto = "Leído";
        if (status.status === "failed") estadoTexto = "Falló";

        console.log(`[ESTADO] Para ${recipient}: ${estadoTexto}`);
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Error procesando webhook:", err);
    return res.sendStatus(500);
  }
}

module.exports = { verifyWebhook, receiveWebhook };
