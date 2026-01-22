# WhatsApp Business Send API (Dev)

API en Node.js + Express para integrar WhatsApp Cloud API (Meta):

- Webhook de verificación y recepción de eventos (mensajes, statuses, Flow replies).
- Endpoint interno para enviar un Flow (cuando tengas el `flow_id`).

## Requisitos

- Node.js (recomendado: Node 20+)
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Copia el ejemplo y completa los valores:

```bash
cp .env.example .env
```

### `.env`

- `PORT`
  - Puerto donde corre Express.

- `WHATSAPP_VERIFY_TOKEN`
  - Token que **tú defines**.
  - Meta lo usa para validar tu webhook en el `GET /webhook` (challenge).

- `WHATSAPP_ACCESS_TOKEN`
  - Bearer token para llamar a Graph API y enviar mensajes/flows.
  - **No lo subas al repositorio**.

- `WHATSAPP_PHONE_NUMBER_ID`
  - `phone_number_id` del número de WhatsApp Cloud API.
  - Se usa para construir el endpoint: `/{PHONE_NUMBER_ID}/messages`.

- `WHATSAPP_API_VERSION`
  - Versión de Graph API. Ej: `v22.0`.

- `WHATSAPP_DEFAULT_FLOW_ID` (opcional)
  - `flow_id` por defecto para el endpoint `POST /api/flows/send`.

- `WHATSAPP_DEFAULT_FLOW_SCREEN` (opcional)
  - Screen inicial del Flow. Default: `START`.

- `WHATSAPP_DEFAULT_FLOW_CTA` (opcional)
  - Texto del botón que abre el Flow.

## Ejecutar en desarrollo

```bash
npm run dev
```

Health check:

- `GET http://localhost:3000/health`

## Endpoints

### Webhook (Meta)

- `GET /webhook`
  - Verificación del webhook (Meta challenge).

- `POST /webhook`
  - Recepción de eventos:
    - `messages` (incluye `interactive.n_flow_reply` para Flows)
    - `statuses`

### Enviar Flow (endpoint interno)

- `POST /api/flows/send`

Body ejemplo:

```json
{
  "to": "569XXXXXXXX",
  "flowId": "TU_FLOW_ID",
  "flowCta": "Comenzar agendamiento",
  "screen": "START"
}
```

Notas:
- `flowId` puede omitirse si configuras `WHATSAPP_DEFAULT_FLOW_ID`.
- Para que funcione el envío necesitas:
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_PHONE_NUMBER_ID`

## Probar webhook en dev con ngrok

```bash
ngrok http 3000
```

En Meta configura:

- Callback URL: `https://<tu-subdominio-ngrok>.ngrok.io/webhook`
- Verify token: el mismo valor que `WHATSAPP_VERIFY_TOKEN`

## Producción (AWS)

En producción reemplazas ngrok por un dominio/URL pública con HTTPS (ALB + ECS/EC2/Lambda, etc.). El código del webhook no cambia; solo actualizas la Callback URL en Meta y las variables de entorno.
