const Diaspora = require('diaspora');
const _ = require('lodash');//a voir plus tard le contenu

const CONFIG = {
    scheme: 'https',
    host: 'api.intra.42.fr',
    path: '/v2',
};

const OAUTH_CONFIG = {
    endPoint: '/oauth/token',
    clientId: 'c5b23de0274db8aeb8dbc2d7dc436baff1803ddb588ce03d132cd46f04b8fd75',
    clientSecret: '563dfb7250390b419648bd1e909227f2f4cda9653b50b690d680e7317f996c58',
    grantType: 'client_credentials',
};

Diaspora.logger.transports[0].level = 'verbose';// on definit le niveau de verbositee

const ftApiAdapter = Diaspora.createNamedDataSource('42api', 'webApi', CONFIG, [
    require('./WebApiOAuth2')(OAUTH_CONFIG),
    require('./DefaultQueryTransformer')(),
    { beforeQuery(queryType, queryNum, modelName, select, update, opts, apiDesc){
        if(queryType !== 'find'){
            return false;
        }

        // const where = apiDesc.queryString.where;
        const {where,options} = apiDesc.queryString;
        console.log({where, options});
        delete apiDesc.queryString.where;
        delete apiDesc.queryString.options;
        if (options.skip !== 0){
            const page = Math.floor((options.skip / 30) + 1);
            Diaspora.logger.verbose(page);
            apiDesc.queryString.page = page;
        }
        // console.log({queryType, queryNum, modelName, select, update, opts, apiDesc});
        // process.exit();
        // const options = apiDesc.queryString.options;
        switch(modelName){
            case 'Event':{
                apiDesc.endPoint = 'campus/1/events'
            }
            break ;
        };

        return apiDesc;
    }}
]);
const localData = Diaspora.createNamedDataSource('localData', 'inMemory');


module.exports = {
    adapters: {
        ftApiAdapter,
        localData,
    },
    Event: Diaspora.declareModel( 'Event', {
        sources:    '42api',
        attributes: {
            name: 'string',
            description: 'string',
            location: 'string',
            kind: 'string',
            max_people: 'number',
            nbr_subscribers: 'number',
            begin_at: 'date',
            end_at: 'date',
            campus_ids: {
                type: 'array',
                of: 'number',
            },
            cursus_ids: {
                type: 'array',
                of: 'number',
            },
            created_at: 'date',
            updated_at: 'date',
        },
    }),
    AdmEvent: Diaspora.declareModel( 'AdmEvent', {
        sources:    'localData',
        attributes: {
            name: 'string',
            description: 'string',
            location: 'string',
            kind: 'string',//verif si c'est une enum et son utilitee
            max_people: 'number',
            nbr_subscribers: 'number',
            begin_at: 'date',
            end_at: 'date',
            cursus_ids: {// a verif
                type: 'array',
                of: 'number',
            },
            created_at: 'date',
            updated_at: 'date',
            duration: 'number',//rajouter une valeur par defaut
            status: {
                type: 'string',
                enum: ['open', 'validated', 'archive'],
                default: 'open',
            },
            helpers_ids: {
                type: 'array',
                of: 'number',
            },
            organiser: 'string',
            custom_rewards: 'string',
        },
    }),
}