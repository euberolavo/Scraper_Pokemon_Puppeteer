PokeScraper
# PokeScraper

_Web Scraper para coletar informações de pokemons_

***********
### Tópicos 

- [Sobre o projeto](#Sobre-o-projeto)

- [Tecnologias](#Tecnologias)

- [Instalação](#Instalação)

- [Funcionamento](#Funcionamento)

- [TelegramBot PokeScraper](#PokeScraperBot)

- [Desenvolvimento](#Desenvolvimento)

- [Observações](#Observações)



***********
## Sobre o projeto

### O projeto foi desenvolvido em NodeJS, com uso da Biblioteca Puppeteer, e implementado em um AWS Lambda e possui:

- Um Lambda que é responsavel pelo scraping e resposta com os dados dos Pokemons;
- Um Endpoit ```GET /``` do API gateway que recebe uma QueryString com o parametro "pokemon";

## Tecnologias
* NodeJS
* Puppeteer
* Serverless
* AWS Lambda
* AWS APIGateway


## Instalação

### Deploy AWS
Clonar o projeto:
```bash
git clone https://github.com/euberolavo/Scraper_Pokemon_Puppeteer.git
```
Baixar as dependências:
```bash
npm install
```
Realizar o deploy via serverless (Necessário já ter realizado configuração do serverless com a AWS)
```bash
serverless deploy
```
### Teste em ambiente de desenvolvimento
Clonar o projeto:
```bash
git clone https://github.com/euberolavo/Scraper_Pokemon_Puppeteer.git
```
Baixar as dependências:
```bash
npm install
```
Criar Pasta Temp (necessário para puppeteer armazenar dados de perfil)
```bash
mkdir undefined/temp
```
Iniciar o Serverless offline
```bash
serverless offline start
```
## Funcionamento

### Local
- Ao iniciar o Serverless, é iniciado um ambiente local de desenvolvimento, onde é criado o endpoint http://localhost:3000/dev , que fica aguardando um parametro "pokemon", com um nome, para iniciar a pesquisa no site https://pokemon.fandom.com/pt-br/wiki/Pok%C3%A9dex_Nacional.
O parâmetro pode ser passado pelo proprio url.
```bash
http://localhost:3000/dev/?pokemon=ninetales
```
Se tudo estiver devidamente configurado, será retornado status **200**, e um JSON, com as informações.
```JSON
{
    "statusCode": 200,
    "body": {
        "name": "ninetales",
        "altura": [
            "1,1 m"
        ],
        "peso": [
            "19,9 kg"
        ],
        "habilidades": [
            " Fogo",
            " Gelo",
            " Fada",
            "Desconhecido",
            "Fogo Luminoso",
            "Seca",
            "Manto Nevado",
            "Alerta de Neve"
        ],
        "types": [
            "Fogo",
            "Gelo",
            "Fada"
        ]
    }
}
```
### AWS
- Após deploy, é criado um endpoint na API Geteway, https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev, que recebe um parametro "pokemon" por querystring.
o endpoint pode ser testado no caminho
```bash
https://worb0n0l5a.execute-api.us-east-1.amazonaws.com/dev?pokemon=geodude
```
Se tudo estiver devidamente configurado, será retornado status **200**, e um JSON, com as informações.
```JSON
{
    "statusCode": 200,
    "body": {
        "name": "dragonite",
        "altura": [
            "2.2 m"
        ],
        "peso": [
            "210.0 kg"
        ],
        "habilidades": [
            "Inner Focus"
        ],
        "types": [
            "Dragon",
            "Flying"
        ]
    }
}
```
*****

## PokeScraperBot

Foi feito um Chatbot [PokeScrap_bot_telegram](https://github.com/euberolavo/PokeScrap_bot_telegram) para o telegram chamado pokeScraper ([@PokeScraperBot](https://t.me/PokeScraperBot)), que está requisitando o pokemon no scraper implantado na AWS Lambda.

## Desenvolvimento
Ao iniciar o desenvolvimento, foquei no scraper, e em pegar as informações corretas no site.

Identifiquei um termo de aceite, que não era canonico ao acessar o site, mas ao aparecer, não permitia o puppeteer colher as informações, mas com um try catch foi contornado.

Para subir a aplicação no AWS, utilizei o Framework Serverless, pois a documentação do Framework possuida informações mais detalhas, o que facilitou a configuração e o deploy.

Tive problemas ao subir a aplicação na AWS, pois tive dificuldades com o chrome-aws-lambda, o que só foi contornado com o uso de uma [layer do chromium](https://github.com/Sparticuz/chromium/tree/master/examples/serverless-with-preexisting-lambda-layer) e o puppeteer-core.
Após contornar esse problema, me deparei com o timeout do Lambda, que tem um limite de 29sec, e identifiquei por meio de logs, que o carregamento inicial do site, demorava por volta de 49sec, o que não viabiliava o uso do site no AWS Lamda.
Sendo assim, optei por trocar o site, por um com um melhor carregamento de página. Fiz a troca pelo [site oficial do Pokemon](https://www.pokemon.com/br/), o que me rendeu bons numeros de carregamento, saindo de 49sec, para 8sec, e viabilizando o scraper no Lambda.

Devido a essa dificuldade com o site do Pokemon, existem 2 arquivos de index, o indexLocal.js e o indexAwsLambda.js, o arquivo local utiliza o site [pokemon fandom](https://pokemon.fandom.com/pt-br/wiki/Pok%C3%A9dex_Nacional), e o arquivo AWS Lambda, utiliza o [site oficial](https://www.pokemon.com/br/).

## Observações

Devido aos dois arquivos index, dependendo da aplicação(local ou deploy), será necessário alterar o caminho do require na linha "1" do handler.js.


