let intra = require('./intra');

const UID = 'c5b23de0274db8aeb8dbc2d7dc436baff1803ddb588ce03d132cd46f04b8fd75';
const SEC = '563dfb7250390b419648bd1e909227f2f4cda9653b50b690d680e7317f996c58';

intra.authenticate(UID, SEC)
    .then((answer) => {
	    intra.setAccessToken(answer.access_token);
	    intra.getEvents()
	    .then((answer) => {
		    for (event of answer) {
			Object.keys(event).forEach((key) => {
				console.log('* ' + key);
			    });
			console.log('>>> ' + event.name);
		    }
		});
	});
