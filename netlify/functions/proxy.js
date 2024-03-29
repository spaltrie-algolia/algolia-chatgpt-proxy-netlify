var algoliasearch = require('algoliasearch');

exports.handler = async event => {

    if (event.httpMethod === 'POST') {
        try {
            // Parse the incoming JSON payload from the request body
            const requestBody = JSON.parse(event.body);
            const ALGOLIA_APP_ID = requestBody.AppId;
            const ALGOLIA_API_KEY = requestBody.ApiKey;
            const ALGOLIA_INDEX_NAME = requestBody.IndexName;
            const query = requestBody.query || '';
            const queryParams = requestBody.queryParams || {};
            console.log('query: ', query);
            console.log('queryParams: ', JSON.stringify(queryParams));

            const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
            const index = client.initIndex(ALGOLIA_INDEX_NAME);

            //let hits = [];

            const hits = await index.search(query, queryParams)
                .then(({ hits }) => hits)
                .catch(error => {
                    console.error('error :', error);
                });

            // Return a success response
            return {
                statusCode: 200,
                body: JSON.stringify(hits),
            };
        } catch (error) {
            // Return an error response if there was an issue processing the request
            console.error('error2 :', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Failed to process POST request =>' + error }),
            };
        }
    }
    else {
        return {
            statusCode: 404,
        }
    }

}