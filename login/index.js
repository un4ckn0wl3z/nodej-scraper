const request = require('request-promise');
const cheerio = require('cheerio');
(async () => {

    let initReq = await request({
        uri: 'http://quotes.toscrape.com/login',
        method: 'GET',
        gzip: true,
        resolveWithFullResponse: true

    });

    let cookie = initReq.headers['set-cookie'].map(v => v.split(';')[0]).join(' ');

    let $ = cheerio.load(initReq.body);
    let csrfToken = $('input[name="csrf_token"]').val();

    try {
        let loginReq = await request({
            uri: 'http://quotes.toscrape.com/login',
            method: 'POST',
            gzip: true,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'quotes.toscrape.com',
                'Origin': 'http://quotes.toscrape.com',
                'Referer': 'http://quotes.toscrape.com/login',
                'Upgrade-Insecure-Requests': '1',
                'Cookie': cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
            },
            formData: {
                'csrf_token': csrfToken,
                'username': 'admin',
                'password': 'admin'
            },
            resolveWithFullResponse: true
        });
    } catch (res) {
        cookie = res.response.headers['set-cookie'].map(v => v.split(';')[0]).join(' ');
        
    }
    let loggedinReq = await request({
        uri: 'http://quotes.toscrape.com',
        method: 'GET',
        gzip: true,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Host': 'quotes.toscrape.com',
            'Origin': 'http://quotes.toscrape.com',
            'Referer': 'http://quotes.toscrape.com/login',
            'Upgrade-Insecure-Requests': '1',
            'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
        }
    });
    debugger;
})();