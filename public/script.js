const Postmonger = window.Postmonger;
var connection = new Postmonger.Session();
var webhookUrl = "";

// Inicializa a atividade ao receber o evento do Journey Builder
connection.on('initActivity', function(payload) {
    console.log("Payload recebido:", payload);

    // Verifica se os argumentos da execução contêm inArguments antes de acessá-los
    if (payload?.arguments?.execute?.inArguments && payload.arguments.execute.inArguments.length > 0) {
        webhookUrl = payload.arguments.execute.inArguments[0]?.webhookUrl || "";
    } else {
        console.error("Erro: inArguments não encontrado no payload.");
        webhookUrl = "";
    }

    document.getElementById('webhookUrl').value = webhookUrl;
});

// Adiciona evento para salvar a configuração da atividade
document.getElementById('save').addEventListener('click', function() {
    webhookUrl = document.getElementById('webhookUrl').value;

    // Garante que os argumentos são formatados corretamente antes de serem enviados
    var activityPayload = {
        arguments: {
            execute: {
                inArguments: webhookUrl ? [{ webhookUrl: webhookUrl }] : [],
                outArguments: []
            }
        }
    };

    console.log("Enviando updateActivity:", activityPayload);
    connection.trigger('updateActivity', activityPayload);
});

// Dispara o evento de prontidão para sinalizar que a atividade está inicializada
connection.trigger('ready');
