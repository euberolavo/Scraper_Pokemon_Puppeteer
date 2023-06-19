const puppeteer = require('puppeteer-core');//AWS Lambda
// const puppeteer = require('puppeteer'); //Local
const chromium = require('@sparticuz/chromium');


const url = `https://www.pokemon.com/br/pokedex/`;

module.exports.runScraper = async (event, context, pokemon) => {


  const browser = await puppeteer.launch({
    headless: 'new', //Local e AWS Lamda  {quando usar local, pode alterar de 'new' pra false, para o chromium não rodar em background, mas é opcional}
    executablePath: await chromium.executablePath(),  //AWS Lambda
    defaultViewport: chromium.defaultViewport,  //AWS Lambda
    args: chromium.args, //AWS Lambda
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

    const obj = {
      "name": pokemon,
      "types": types
    };

    console.log('gotcha!');
    console.log('esse é o seu pokemon');
    // Converte para JSON
    const json = obj;
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
