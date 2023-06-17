const puppeteer = require("puppeteer");

const url = "https://pokemon.fandom.com/pt-br/wiki/Pok%C3%A9dex_Nacional";
const searchFor = "Charizard";

const list = [];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  console.log("iniciei");

  await page.goto(url);
  console.log("fui para url");

  await page.waitForSelector("._2O--J403t2VqCuF8XJAZLK");
  await page.click("._2O--J403t2VqCuF8XJAZLK");
  console.log("aceitei");

  await page.waitForSelector(".global-navigation__search");
  await page.click(".global-navigation__search");
  console.log("pesquisa");

  await page.waitForSelector(".SearchInput-module_input__LhjJF");
  await page.type(".SearchInput-module_input__LhjJF", searchFor);

  await page.waitForSelector(".SearchResultHightlight-module_highlight__t087Y");
  await page.click(".SearchResultHightlight-module_highlight__t087Y");

  //Pegando informações
  await page.waitForSelector(".mw-page-title-main");
  const name = await page.$$eval(
    ".mw-page-title-main",
    (elements) => elements.map((element) => element.innerText)
  );

  await page.waitForSelector("#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)");
  const weight = await page.$$eval(
    "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)",
    (elements) => elements.map((element) => element.innerText)
  );

  await page.waitForSelector("#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(1)");
  const height = await page.$$eval(
    "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(1)",
    (elements) => elements.map((element) => element.innerText)
  );


  await page.waitForSelector(".modoclaroescuro > table > tbody > tr > td > span > a > font");
  const types = await page.$$eval(
    ".modoclaroescuro > table > tbody > tr > td > span > a > font",
    (elements) => elements.map((element) => element.innerText)
  );

  const obj = {};
  obj.name = name;
  obj.types = types;
  obj.height = height;
  obj.weight = weight;

  list.push(obj);

  console.log(obj);

  await page.waitForTimeout(6000);
  await browser.close();
})();