const puppeteer = require('puppeteer'); //Local

const url = `https://pokemon.fandom.com/pt-br/wiki/`;

module.exports.runScraper = async (event, context, pokemon) => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  try {
    const page = await browser.newPage();
    console.log('Começou!');

    await page.setDefaultNavigationTimeout(0);

    console.log('Indo para localização do Pokemon...');
    await page.goto(url + pokemon);
    console.log('cheguei!');

    // Pegando informações
    await page.waitForSelector(
      '#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)'
    );
    const weight = await page.$$eval(
      '#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)',
      (elements) => elements.map((element) => element.innerText)
    );

    await page.waitForSelector(
      '#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(1)'
    );
    const height = await page.$$eval(
      '#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(1)',
      (elements) => elements.map((element) => element.innerText)
    );

    await page.waitForSelector(
      '.modoclaroescuro > table > tbody > tr > td > span > a > font'
    );
    const types = await page.$$eval(
      '.modoclaroescuro > table > tbody > tr > td > span > a > font',
      (elements) => elements.map((element) => element.innerText)
    );

    await page.waitForSelector(
      '.modoclaroescuro > table > tbody > tr > td > span'
    );
    const skill = await page.$$eval(
      '.modoclaroescuro > table > tbody > tr > td > span',
      (elements) => elements.map((element) => element.innerText)
    );

    const obj = {
      name: pokemon,
      altura: height,
      peso: weight,
      habilidades: skill,
      types: types,
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
