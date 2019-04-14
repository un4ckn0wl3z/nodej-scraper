const request = require('request-promise').defaults({
    proxy: 'http://user:password@ip:port'
});

( async () => {

    //let response = await request('https://httpbin.org/ip', proxy: '');
    let response = await request('https://httpbin.org/ip');
    console.log(response);
    debugger;
})();