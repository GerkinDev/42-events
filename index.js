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
    { beforeQuery(queryType, queryNum, modelName, select, update, options, apiDesc){
        if(queryType !== 'find'){
            return false;
        }

        const where = apiDesc.queryString.where;
        delete apiDesc.queryString.where;
        delete apiDesc.queryString.options;
        return apiDesc;
    }}
]);
const Event = Diaspora.declareModel( 'Event', {
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
});
// Diaspora.createNamedDataSource('localMongo', 'mongo', {
//     username: 'root',
//     password: 'root',
//     database: '42events',
//     authSource: 'admin',
// });
// const LocEvent = Diaspora.declareModel( 'LocEvent', {
// 	sources:    'localMongo',
// 	attributes: {
//         name: 'string',
//         description: 'string',
//         location: 'string',
//         kind: 'string',
//         max_people: 'number',
//         nbr_subscribers: 'number',
//         begin_at: 'date',
//         end_at: 'date',
//         campus_ids: {
//             type: 'array',
//             of: 'number',
//         },
//         cursus_ids: {
//             type: 'array',
//             of: 'number',
//         },
//         created_at: 'date',
//         updated_at: 'date',
//     },
// });

ftApiAdapter.waitReady().then(async () => {
    const collection = await Event.findMany();
    const events = collection.map('attributes').value();
    // const locEvents = await LocEvent.insertMany(events);
    // console.log(locEvents.map('attributes').value());
    console.log(events);
});

