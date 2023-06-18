const { runScraper } = require('./index');

module.exports.hello = async (event, context, callback) => {

  try {
    // Executar a função runScraper e aguardar a conclusão
    const result = await runScraper(event, context, callback);

    // Construir a resposta com as informações obtidas pelo runScraper
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };

    return response;
  } catch (error) {
    // Exibir o erro no console do CloudWatch
    console.log(error);

    // Em caso de erro, enviar uma resposta de erro
    const errorResponse = {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Ocorreu um erro ao processar a solicitação. POKEPEDIA',
      }),
    };


    return errorResponse;
  }
};
