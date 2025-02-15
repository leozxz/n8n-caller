const Postmonger = window.Postmonger;
var connection = new Postmonger.Session();
var payload = {};  // Guardamos a payload completa
var webhookUrl = "";

connection.on('initActivity', function(data) {
    console.log("Payload recebido:", data);
    payload = data || {};  // Garante que o payload seja armazenado corretamente

    // Garantindo que inArguments existe no payload recebido
    if (payload.arguments && payload.arguments.execute && payload.arguments.execute.inArguments) {
        webhookUrl = payload.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl || "";
    } else {
        console.error("inArguments não encontrado no payload. Definindo um valor padrão.");
        webhookUrl = "";
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = [{}]; // Criando um objeto vazio caso inArguments não exista
    }

    document.getElementById('webhookUrl').value = webhookUrl;
});

document.getElementById('save').addEventListener('click', function() {
    webhookUrl = document.getElementById('webhookUrl').value;

    var activityPayload = {
        name: payload.name || "Enviar para Webhook",
        id: payload.id || null, // Preserva o ID se ele existir
        key: payload.key || "REST-1",
        type: "REST",
        arguments: {
            execute: {
                inArguments: [
                    { webhookUrl: webhookUrl }
                ],
                outArguments: []
            }
        }
    };

    console.log("Enviando updateActivity:", activityPayload);
    connection.trigger('updateActivity', activityPayload);
});

// Garante que a atividade esteja pronta para ser configurada
connection.trigger('ready');