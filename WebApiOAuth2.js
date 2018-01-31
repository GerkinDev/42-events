const _ = require('lodash');

module.exports = function OAuth2QueryTransformer(config){
    let authInfos;


    return {
        async authenticate(url, params){
            authInfos = {
                response: await this.sendRequest(
                    'POST',
                    url,
                    null,
                    params
                )
            };
            const expiresIn = _.get(authInfos, 'response.expires_in');

            authInfos.expirationDate = new Date();
            authInfos.expirationDate.setSeconds(authInfos.expirationDate.getSeconds() + expiresIn);
            if(_.isNumber(expiresIn)){
                setTimeout(() => this.emit('authenticate', url, params), expiresIn * 1000);
            }
        },

        async initialize(){
            const params = {
                grant_type: config.grantType,
                client_id: config.clientId,
                client_secret: config.clientSecret,
            };

            const { URL } = require('url');
            const url = new URL(this.baseEndPoint);
            url.pathname = config.endPoint;

            return this.emit('authenticate', url, params);
        },

        beforeQuery(queryType, queryNum, modelName, select, update, options, apiDesc){
            return _.defaultsDeep({
                queryString: {
                    access_token: authInfos.response.access_token
                },
            }, apiDesc);
        }
    };
}