const _ = require('lodash');//a voir plus tard le contenu

const {
    adapters: {
        ftApiAdapter,
        localData,
    },
    Event,
    AdmEvent,
} = require('./models');
console.log(AdmEvent);
const { sleep } = require('./utils');


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
        page++;
        allEvents.push(...arrayCollection.map('attributes').value());
        // Avoid spam error from 42 api
        await sleep(1000);
    } while (arrayCollection.value().length === 30);
    console.log(page);
    console.log(allEvents.length);



    // const collectionNoPage = await Event.findMany({}, {page: 0, limit: 30});
    // const eventsNoPage = collectionNoPage.map('attributes').value();


    // const locEvents = await LocEvent.insertMany(events);
    // console.log(locEvents.map('attributes').value());
    // console.log(require('util').inspect(events, {colors:true}));
    // console.log(require('util').inspect({lastItemEvents:events.slice(-1), lastItemEventsNoPage:eventsNoPage.slice(-1)}, {colors:true}));
});

