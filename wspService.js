const https = require('https');
const http = require('http');

//logica para enviar mensaje interactivo con WhatsApp con imagen, body, footer y dos botones
const enviarMensajeWsp = (phone, mesg, boton1, boton2) => {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "image",
                "image": {
                    "link": "https://via.placeholder.com/800x600?text=Agendamiento"
                }
            },
            "body": {
                "text": mesg
            },
            "footer": {
                "text": "Información que necesitarás:\n- Fecha y hora de llegada\n- Tipo y cantidades de camiones\n- Información de bins\n- Variedad de fruta"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "comenzar",
                            "title": Comenzar
                        }
                    },
                    { 
                        "type": "reply",
                        "reply": {
                            "id": "hablar_asesor",
                            "title": "Hablar con un asesor"
                        }
                    }
                ]
            }
        }
    });
    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: '/v22.0/943088742220640/messages',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
        }
    };
    const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            console.log('Mensaje enviado:', responseData);
        });
    });
    req.on('error', (error) => {
        console.error('Error al enviar el mensaje:', error);
    }
    );
    req.write(data);
    req.end();
};
module.exports = {
    enviarMensajeWsp,
};