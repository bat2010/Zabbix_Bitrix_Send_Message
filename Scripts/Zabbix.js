var BitrixHook = {
    webhook: null,
    to: null,
    message: null,


    sendMessage: function () {
        var params = {
            DIALOG_ID: BitrixHook.to,
            MESSAGE: BitrixHook.message,
        },
        data,
        response,
        request = new HttpRequest(),
        url = BitrixHook.webhook + '/im.message.add.json';

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);
        Zabbix.log(4, '[BitrixHook Webhook] URL: ' + url);
        Zabbix.log(4, '[BitrixHook Webhook] params: ' + data);
        response = request.post(url, data);
        Zabbix.log(4, '[BitrixHook Webhook] HTTP code: ' + request.getStatus());

        try {
            response = JSON.parse(response);
        }
        catch (error) {
            response = null;
        }

        if (request.getStatus() !== 200)  {
            if (typeof response.error_description === 'string') {
                throw response.error_description;
            }
            else {
                throw 'Unknown error';
            }
        }
    }
};

try {
    var params = JSON.parse(value);

    BitrixHook.to = params.To;
    BitrixHook.message = params.Subject + '\n' + params.Message;
    BitrixHook.webhook = params.URL

    BitrixHook.sendMessage();

    return 'OK';
}
catch (error) {
    Zabbix.log(4, '[BitrixHook Webhook] notification failed: ' + error);
    throw 'Sending failed: ' + error + '.';
}