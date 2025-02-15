document.addEventListener("DOMContentLoaded", function () {
    const Postmonger = window.Postmonger;
    var connection = new Postmonger.Session();
    var payload = {};
    var webhookUrl = "";

    const webhookInput = document.getElementById("webhookUrl");
    const saveButton = document.getElementById("save");
    const doneButton = document.getElementById("done");

    if (!webhookInput || !saveButton || !doneButton) {
        console.error("❌ Erro: Elementos do DOM não foram encontrados.");
        return;
    }

    // Evento que recebe a atividade inicial
    connection.on('initActivity', function (data) {
        console.log("Payload recebido:", data);
        payload = data || {};

        if (payload.arguments?.execute?.inArguments) {
            webhookUrl = payload.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl || "";
        } else {
            console.warn("⚠️ inArguments não encontrado no payload. Criando um valor padrão.");
            webhookUrl = "";
            payload.arguments = payload.arguments || {};
            payload.arguments.execute = payload.arguments.execute || {};
            payload.arguments.execute.inArguments = [{}];
        }

        webhookInput.value = webhookUrl;
        connection.trigger('ready');
    });

    // Atualiza os dados ao clicar no botão "Salvar"
    saveButton.addEventListener('click', function () {
        webhookUrl = webhookInput.value;

        var activityPayload = {
            name: payload.name || "Enviar para Webhook",
            id: payload.id || null,
            key: payload.key || "REST-1",
            type: "REST",
            configurationArguments: {
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
    doneButton.addEventListener('click', function () {
        console.log("✅ Atividade configurada com sucesso!");
        connection.trigger('validateActivity');
    });
});
