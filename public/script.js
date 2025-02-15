const Postmonger = window.Postmonger;
var connection = new Postmonger.Session();
var webhookUrl = "";

connection.on('initActivity', function(payload) {
    console.log("Payload recebido:", payload);

    if (payload.arguments && payload.arguments.execute && payload.arguments.execute.inArguments) {
        webhookUrl = payload.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl || "";
    } else {
        webhookUrl = "";
        console.error("inArguments não encontrado no payload.");
    }

    document.getElementById('webhookUrl').value = webhookUrl;
});

document.getElementById('save').addEventListener('click', function() {
    webhookUrl = document.getElementById('webhookUrl').value;

    var activityPayload = {
        name: "Enviar para Webhook",
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

connection.trigger('ready');
