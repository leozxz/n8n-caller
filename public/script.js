var connection = new Postmonger.Session();
var webhookUrl = "";

connection.on('initActivity', function(payload) {
    console.log("Payload recebido:", payload);
    webhookUrl = payload.arguments.execute.inArguments[0]?.webhookUrl || "";
    document.getElementById('webhookUrl').value = webhookUrl;
});

document.getElementById('save').addEventListener('click', function() {
    webhookUrl = document.getElementById('webhookUrl').value;

    var activityPayload = {
        arguments: {
            execute: {
                inArguments: [
                    { webhookUrl: webhookUrl }
                ],
                outArguments: []
            }
        }
    };

    connection.trigger('updateActivity', activityPayload);
});

connection.trigger('ready');