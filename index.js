const puppeteer = require("puppeteer");

const url = "https://pokemon.fandom.com/pt-br/wiki/Pok%C3%A9dex_Nacional";
const searchFor = "Ninetales";

const list = [];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  console.log("Começou!");

  console.log("Indo para localização do Pokemon...");
  await page.goto(url);

  await page.waitForSelector("._2O--J403t2VqCuF8XJAZLK");
  await page.click("._2O--J403t2VqCuF8XJAZLK");
  console.log("cheguei!");

  await page.waitForSelector(".global-navigation__search");
  await page.click(".global-navigation__search");
  console.log("Procurando Pokemon...");

  await page.waitForSelector(".SearchInput-module_input__LhjJF");
  await page.type(".SearchInput-module_input__LhjJF", searchFor);
  console.log("Pokemon encontrado!");

  await page.waitForSelector(".SearchResultHightlight-module_highlight__t087Y");
  await page.click(".SearchResultHightlight-module_highlight__t087Y");
  console.log("tentativa de captura...");

  // Pegando informações
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

  await page.waitForSelector("#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(10) > td > table:nth-child(2) > tbody > tr > td > span");
  const skill = await page.$$eval(
    "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(10) > td > table:nth-child(2) > tbody > tr > td > span",
    (elements) => elements.map((element) => element.innerText)
  );

  
  
  const obj = {};
  obj.name = name;
  obj.types = types;
  obj.height = height;
  obj.weight = weight;
  obj.skill = skill;

  list.push(obj);
 

  console.log("gotcha!");
  console.log("esse é o seu pokemon");
  console.log(obj);

  await page.waitForTimeout(6000);
  await browser.close();
})();
