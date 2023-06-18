const chrome = require('chrome-aws-lambda');
const nomeDoPokemon = require('./config/pokemon');
const puppeteer = require('puppeteer-core');
const chromium = require("@sparticuz/chromium");

const url = 'https://pokemon.fandom.com/pt-br/wiki/Pok%C3%A9dex_Nacional';
const searchFor = nomeDoPokemon;

module.exports.runScraper = async (event, context, callback) => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: await chromium.executablePath(),
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    // userDataDir: '/tmp/puppeteer_dev_chrome_profile',
  });

  try {
    const page = await browser.newPage();
    console.log('Começou!');

    await page.setDefaultNavigationTimeout(0);

    await page.goto(url);
    console.log('Indo para localização do Pokemon...');
    

    try {
      await page.waitForSelector('._2O--J403t2VqCuF8XJAZLK', {
        timeout: 1000,
      });
      await page.click('._2O--J403t2VqCuF8XJAZLK');
    } catch (error) {
      console.log(
        'Tempo limite atingido ao aguardar o seletor. Continuando o código...'
      );
    }
    console.log('cheguei!');
    await page.waitForSelector('.global-navigation__search');
    await page.click('.global-navigation__search');
    console.log('Procurando Pokemon...');

    await page.waitForSelector('.SearchInput-module_input__LhjJF');
    await page.type('.SearchInput-module_input__LhjJF', searchFor);
    console.log('Pokemon encontrado!');

    await page.waitForSelector(
      '.SearchResultHightlight-module_highlight__t087Y'
    );
    await page.click('.SearchResultHightlight-module_highlight__t087Y');
    console.log('tentativa de captura...');

    // Pegando informações
    await page.waitForSelector('.mw-page-title-main');
    const name = await page.$$eval('.mw-page-title-main', (elements) =>
      elements.map((element) => element.innerText)
    );

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
      '#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(10) > td > table > tbody > tr > td > span'
    );
    const skill = await page.$$eval(
      '#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(10) > td > table > tbody > tr > td > span',
      (elements) => elements.map((element) => element.innerText)
    );

    const obj = {
      name: name,
      types: types,
      height: height,
      weight: weight,
      skill: skill,
    };

    console.log('gotcha!');
    console.log('esse é o seu pokemon');
    // Converte para JSON
    const json = JSON.stringify(obj);
    console.log(json);

    // await page.waitForTimeout(6000);
    await browser.close();

    // Retornar resultado ao handler
    callback(null, {
      statusCode: 200,
      body: json,
    });
  } catch (error) {
    console.log(error);
    console.log('erro na aplicação');
    return 
  }
};