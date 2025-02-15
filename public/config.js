define([], function () {
    return {
        "workflowApiVersion": "1.1",
        "metaData": {
            "icon": "https://example.com/icon.png",
            "category": "message"
        },
        "type": "REST",
        "lang": {
            "en-US": {
                "name": "Enviar para Webhook",
                "description": "Atividade que envia dados para um Webhook"
            }
        },
        "configurationArguments": {
            "configUrl": "https://seu-servidor.com/config.js"
        },
        "schema": {
            "arguments": {
                "execute": {
                    "inArguments": [{ "webhookUrl": { "dataType": "Text", "isRequired": true } }],
                    "outArguments": []
                }
            }
        }
    };
});
