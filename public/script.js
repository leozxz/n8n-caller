const Postmonger = window.Postmonger;
var connection = new Postmonger.Session();
var payload = {};
var webhookUrl = "";

// Evento que recebe a atividade inicial
connection.on('initActivity', function (data) {
    console.log("Payload recebido:", data);
    payload = data || {}; 

    // Garantindo que os argumentos existem
    if (payload.arguments && payload.arguments.execute && payload.arguments.execute.inArguments) {
        webhookUrl = payload.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl || "";
    } else {
        console.error("⚠️ inArguments não encontrado no payload. Criando um valor padrão.");
        webhookUrl = "";
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = [{}]; 
    }

    // Atualiza o campo do webhook
    document.getElementById('webhookUrl').value = webhookUrl;
    connection.trigger('ready'); // Ativa a Custom Activity
});

// Atualiza os dados no botão "Salvar"
document.getElementById('save').addEventListener('click', function () {
    webhookUrl = document.getElementById('webhookUrl').value;

    var activityPayload = {
        name: payload.name || "Enviar para Webhook",
        id: payload.id || null, 
        key: payload.key || "REST-1",
        type: "REST",
        configurationArguments: { // Garante que a configuração seja válida
            publish: { inArguments: [{ webhookUrl: webhookUrl }] },
            validate: { inArguments: [{ webhookUrl: webhookUrl }] }
        },
        arguments: {
            execute: {
                inArguments: [{ webhookUrl: webhookUrl }],
                outArguments: []
            }
        }
    };

    console.log("📢 Enviando updateActivity:", activityPayload);
    connection.trigger('updateActivity', activityPayload);
});

// Quando o usuário clica em "Done"
document.getElementById('done').addEventListener('click', function () {
    console.log("✅ Atividade configurada com sucesso!");
    connection.trigger('validateActivity'); // Garante que o Marketing Cloud reconheça a configuração
});