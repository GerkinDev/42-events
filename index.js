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

Diaspora.createNamedDataSource('localData', 'inMemory');

const AdmEvent = Diaspora.declareModel( 'AdmEvent', {
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
});
console.log(AdmEvent);
process.exit();

//https://profile.intra.42.fr/events/1526

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


async function sleep(timeout){
    return new Promise(resolve => setTimeout(resolve, timeout));
}
ftApiAdapter.waitReady().then(async () => {
    // const collection = await Event.findMany({}, {page: 1, limit: 30});
    // const events = collection.map('attributes').value();
    let page = 0;
    let arrayCollection;
    const allEvents = [];

    do
    {
     // arrayCollection = await Event.findMany({}, {page, limit: 30});
     arrayCollection = await Event.findMany({}, {page, limit: 30});
     console.log(page);
     page++;
     console.log(arrayCollection[0]);
     allEvents.push(...(arrayCollection.map('attributes').value()));
     await sleep(1000);
    }while (arrayCollection.value().length === 30)
    console.log(page);
    console.log(allEvents.length);



    // const collectionNoPage = await Event.findMany({}, {page: 0, limit: 30});
    // const eventsNoPage = collectionNoPage.map('attributes').value();


    // const locEvents = await LocEvent.insertMany(events);
    // console.log(locEvents.map('attributes').value());
    // console.log(require('util').inspect(events, {colors:true}));
    // console.log(require('util').inspect({lastItemEvents:events.slice(-1), lastItemEventsNoPage:eventsNoPage.slice(-1)}, {colors:true}));
});

