const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 8080;
const validUrl = require('valid-url');

var parseUrl = function(url) {
    url = decodeURIComponent(url);
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

app.get('/', function(req, res) {
  var urlToScreenshot = parseUrl(req.query.url);
  const notFull = !!req.query.notFull;
  const fullPage = !notFull;


    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToScreenshot);
            await page.screenshot({fullPage: fullPage}).then(function(buffer) {
                res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                res.setHeader('Content-Type', 'image/png');
                res.send(buffer);
            });

            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToScreenshot);
    }

});


app.get('/body', function(req, res) {
  var urlToScrape = parseUrl(req.query.url);
  const notFull = !!req.query.notFull;
  const fullPage = !notFull;


  if (validUrl.isWebUri(urlToScrape)) {
    console.log('Screenshotting: ' + urlToScrape);
    (async() => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.goto(urlToScrape);
      await page.content().then(function(buffer) {
        res.setHeader('Content-Type', 'text/html');
        res.send(buffer);
      });

      await browser.close();
    })();
  } else {
    res.send('Invalid url: ' + urlToScrape);
  }

});

app.get('/health', function(req, res) {
  res.send('ok');
});

app.listen(port, function() {
  console.log('App listening on port ' + port);
});
