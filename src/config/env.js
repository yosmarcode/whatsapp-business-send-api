function optional(name, fallback = undefined) {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

function required(name) {
  const v = optional(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const env = {
  PORT: Number(optional("PORT", 3000)),

  WHATSAPP_VERIFY_TOKEN: required("WHATSAPP_VERIFY_TOKEN"),

  WHATSAPP_ACCESS_TOKEN: optional("WHATSAPP_ACCESS_TOKEN"),
  WHATSAPP_PHONE_NUMBER_ID: optional("WHATSAPP_PHONE_NUMBER_ID"),
  WHATSAPP_API_VERSION: optional("WHATSAPP_API_VERSION", "v22.0"),

  WHATSAPP_DEFAULT_FLOW_ID: optional("WHATSAPP_DEFAULT_FLOW_ID"),
  WHATSAPP_DEFAULT_FLOW_SCREEN: optional("WHATSAPP_DEFAULT_FLOW_SCREEN", "START"),
  WHATSAPP_DEFAULT_FLOW_CTA: optional("WHATSAPP_DEFAULT_FLOW_CTA", "Comenzar")
};

module.exports = { env };
