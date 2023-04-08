
async function paymentmomo(amount) {

    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    var partnerCode = "MOMOIY6L20220625";
    var accessKey = "9hvcineYO8gf5NAk";
    var secretkey = "LOAQkwrK57jnVGmDBPxmvnxX1sSHPpuj";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "pay with MoMo";
    var redirectUrl = "https://youtube.com";
    var ipnUrl = redirectUrl;
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = amount;
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
    //puts raw signature
    //console.log("--------------------RAW SIGNATURE----------------")
    //console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    //console.log("--------------------SIGNATURE----------------")
    //console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'en'
    });
    //Create the HTTPS objects
    const https = require('https');
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    }
    let payUrl; // declare the variable outside of the function

    const req = https.request(options, res => {
        res.setEncoding('utf8');
        res.on('data', body => {
          return  payUrl = JSON.parse(body).payUrl;
        });
        res.on('end', () => {
           // console.log('No more data in response.');
        });
    });

    req.on('error', e => {
        console.log(`problem with request: ${e.message}`);
    });

    // use the payUrl variable outside of the function
   // wait for 5 seconds before logging the payUrl value

    // write data to request body
   // console.log("Sending....")

    req.write(requestBody);

    req.end();
    while (!payUrl) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return payUrl;
   // setTimeout(() => {
   //    return  payUrl;
    //}, 500);
}

module.exports = paymentmomo;