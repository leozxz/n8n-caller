document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM carregado!");

    const Postmonger = window.Postmonger;
    const connection = new Postmonger.Session();
    let payload = {};
    let webhookUrl = "";

    connection.on('initActivity', function (data) {
        console.log("📢 Payload recebido:", data);
        payload = data || {};

        if (payload.arguments?.execute?.inArguments) {
            webhookUrl = payload.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl || "";
        } else {
            webhookUrl = "";
            payload.arguments = payload.arguments || {};
            payload.arguments.execute = payload.arguments.execute || {};
            payload.arguments.execute.inArguments = [{ webhookUrl: "" }];
        }

        document.getElementById("webhookUrl").value = webhookUrl;
        connection.trigger('ready');
    });

    document.getElementById("save").addEventListener("click", function () {
        webhookUrl = document.getElementById("webhookUrl").value;

        let activityPayload = {
            name: payload.name || "Enviar para Webhook",
            id: payload.id || null,
            key: payload.key || "REST-1",
            type: "REST",
            arguments: {
                execute: {
                    inArguments: [{ webhookUrl: webhookUrl }],
                    outArguments: []
                }
            }
        };

        console.log("📢 Atualizando Atividade:", activityPayload);
        connection.trigger("updateActivity", activityPayload);
    });

    connection.trigger("initActivity");
});
