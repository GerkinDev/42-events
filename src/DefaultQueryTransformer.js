const _ = require('lodash');

module.exports = function DefaultQueryTransformer(config){
	/**
	* Get the plural name of an endpoint.
	*
	* @param   {string} endPoint - Name of the endpoint.
	* @returns {string} Plural version of the endpoint name.
	*/
	function getPluralEndpoint( endPoint ) {
        return _.get(config, ['pluralApis', endPoint], `${endPoint}s`);
    }

    return {
        beforeQuery(queryType, queryNum, modelName, select, update, options, apiDesc){
            const method = ({
                find: 'GET',
                update: 'PATCH',
                delete: 'DELETE',
                insert: 'POST',
            })[queryType];

            return _.defaultsDeep({
                method,
                endPoint: (queryNum === 'many' ? getPluralEndpoint(modelName) : modelName).toLowerCase(),
                queryString: {
                    where: select,
                    options,
                },
                body: update
            }, apiDesc);
        }
    };
}