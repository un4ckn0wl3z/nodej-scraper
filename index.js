const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');
const request = require('request');



const URLs = [
    { id: 'die_hard', url: 'https://www.imdb.com/title/tt1606378/?ref_=nv_sr_4?ref_=nv_sr_4' },
    { id: 'avatar', url: 'https://www.imdb.com/title/tt0499549/?ref_=nv_sr_1?ref_=nv_sr_1' }
];

(async () => {
    let movies_data = [];
    for (let movie of URLs) {
        const response = await requestPromise({
            uri: movie.url,
            headers: {
                'Host': 'www.imdb.com',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept-Encoding': 'gzip, deflate, br',
                'accept-language': 'th-TH,th;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
            },
            gzip: true
        });
        let $ = cheerio.load(response);
        let title = $('div[class="title_wrapper"] > h1').text().trim();
        let rating = $('div[class="ratingValue"] > strong > span').text();
        let img_url = $('div[class="poster"] > a > img ').attr('src');
        let total_rating = $('div[class="imdbRating"] > a ').text();
        let release_date = $('a[title="See more release dates"]').text().trim();
        // console.log(title, rating, img_url, total_rating, release_date);
        let genres = [];
        $('div[class="title_wrapper"] a[href^="/search/title?genres"]').each((i, elm) => {
            let genre = $(elm).text();
            // console.log(genre);
            genres.push(genre);
        });
        movies_data.push({
            title,
            rating,
            img_url,
            total_rating,
            release_date,
            genres
        });


        let file = fs.createWriteStream(`${movie.id}.jpg`);

        await new Promise((resolve, reject) => {
            let stream = request({
                uri: img_url,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'accept-language': 'th-TH,th;q=0.9,en;q=0.8',
                    'Cache-Control': 'max-age=0',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
                },
                gzip: true

            }).pipe(file).on('finish', () => {
                console.log(`${movie.id}.jpg >> success download`);
                resolve();
            }).on('error',(err) => {
                reject(err);
            });
        }).catch(err => {
            console.log(`${movie.id}.error >> ${err}`);
        });
        // debugger;
        // console.log(`Title : ${title}`);
        // console.log(`Rating: ${rating}`);
        // console.log(`Img_url: ${img_url}`);
        // console.log(`Total_rating: ${total_rating}`);
        // console.log(`Release_date: ${release_date}`);
        // console.log(`Genres: ${genres}`);

    }
    // fs.writeFileSync('./data.json',JSON.stringify(movies_data),'utf-8');

    // const fields = ['title', 'rating'];
    // const json2csvParser = new Parser({ fields });
    // const csv = json2csvParser.parse(movies_data);

    // console.log(csv);
    // fs.writeFileSync('./data.csv', csv, 'utf-8');

    // console.log(movies_data);

    // debugger;

})()
