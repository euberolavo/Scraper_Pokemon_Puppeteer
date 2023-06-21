// const { runScraper } = require('./indexLocal');
const { runScraper } = require("./indexAwsLambda");

module.exports.findPokemon = async (event, context) => {
  try {
    const pokemon = event.query.pokemon;

    // Executar a função runScraper e aguardar a conclusão
    const result = await runScraper(event, context, pokemon);

    // Construir a resposta com as informações obtidas pelo runScraper
    const response = {
      statusCode: 200,
      body: result,
    };
    return response;
  } catch (error) {
    // Exibir o erro no console do CloudWatch
    console.log(error);

    // Em caso de erro, enviar uma resposta de erro
    const errorResponse = {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Ocorreu um erro ao processar a solicitação.',
      }),
    };

    return errorResponse;
  }
};
