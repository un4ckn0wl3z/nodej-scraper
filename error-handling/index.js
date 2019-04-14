const request = require('request-promise');
request.debug = 1;

(async () => {

    console.log('initial request...');
    try {
    let status = await request({
        uri: 'https://httpbin.org/status/500',
        resolveWithFullResponse: true
    });
    } catch (response) {
        //console.log(response);
        if(response.statusCode == 300) {
            console.log('OK');
        }else{
            console.log('Error: ' + response);
            process.exit(1);
        }
    }
    //

})();