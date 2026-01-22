const { env } = require('node:process');
const enviarMensajeWsp = require('./wspService');


const verificarWsp = (req, res) => {
    const token = "TCITPAKITTOKEN"; // Reemplaza con tu token de verificación
    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const verifyToken = req.query["hub.verify_token"];
    if (mode && verifyToken) {
        if (mode === "subscribe" && verifyToken === token) {
            
            res.status(200).send(challenge);
        }
    } else {
        res.sendStatus(403);
    }
};

const recibirWsp = (req, res) => {
    try {
        const mensaje = req.body["entry"][0]["changes"][0]["value"]["messages"][0];
        const phone = mensaje.from;
        const text = mensaje.text.body;
        console.log(`Mensaje recibido de ${phone}: ${text}`);
        
        const bodyText = "Bienvenido al sistema de agendamiento, por favor completa el siguiente formulario para agendar tu recepción o despacho";
        enviarMensajeWsp(phone, bodyText, "Comenzar", "Hablar con un asesor");
        res.status(200).send("Mensaje recibido correctamente");
    } catch (error) {
        console.error("Error al recibir el mensaje de WhatsApp:", error);
        res.status(500).send("Error al procesar el mensaje");
    }
};

module.exports = {
    recibirWsp,
    verificarWsp,
};
