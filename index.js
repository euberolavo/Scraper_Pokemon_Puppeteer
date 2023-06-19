// const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const pokemon = 'pikachu';
const url = `https://www.pokemon.com/br/pokedex/`;

const list = [];

module.exports.runScraper = async (event, context) => {

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: await chromium.executablePath(),
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    // userDataDir: '/tmp/puppeteer_dev_chrome_profile',
  });

  try {
    const page = await browser.newPage();
    console.log('Começou!');

    await page.setDefaultNavigationTimeout(0);

    console.log('Indo para localização do Pokemon...');
    await page.goto(url + pokemon);
    console.log('cheguei!');

    await page.waitForSelector('.dtm-type > ul > li > a');
    const types = await page.$$eval('.dtm-type > ul > li > a', (elements) =>
      elements.map((element) => element.innerText)
    );

    const obj = {};
    (obj.name = pokemon), (obj.types = types), list.push(obj);

    console.log('gotcha!');
    console.log('esse é o seu pokemon');
    // Converte para JSON
    const json = JSON.stringify(obj);
    console.log(json);

    // Fechando o browser
    await browser.close();

    // Retornar resultado
    return json;
  } catch (error) {
    console.log(error);
    console.log('erro na aplicação');
    // Retornar erro
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro na aplicação' }),
    };
  }
};
