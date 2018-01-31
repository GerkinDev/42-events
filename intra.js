let https = require('https');

// The root of all API endpoints
const ROOT_URL = 'api.intra.42.fr';

// Used for emitting requests
let accessToken;

// Emit an encoded HTTP request to the API server
function sendRequest(method, path, params, timeout = 0) {
  switch (method) {
    case 'GET':
    case 'POST':
      break;
    default:
      throw new MethodError('Unknown method: ' + methodUpper
        + '\nHint: The method name must be capitalized');
  }

  let options = {
    hostname: ROOT_URL,
    method: method,
    path: path,
    timeout: timeout
  };

  return new Promise((resolve, reject) => {
    let buffer = '';
    let req = https.request(options, (res) => {
      res.on('data', (data) => {
        buffer += data;
      });
      res.on('end', () => {
        resolve(buffer);
      });
    });
    if (method == 'POST')
      req.write(params);
    req.end();

// TODO: Handle possible cases where the request is aborted

  });
}

// Query a protected endpoint of the API
function queryEndpoint(method, endpoint, params, timeout = 0) {
  if (typeof method != 'string' || typeof endpoint != 'string')
    throw new TypeError('method and path must be strings');
  else if (typeof timeout != 'number' || timeout < 0)
    throw new TypeError('timeout must be a valid number');
  else if (typeof accessToken == 'undefined')
    throw new RequestError('No access token was set'
      + '\nHint: use setAccessToken() before your queries');

  return new Promise((resolve, reject) => {
    let path = endpoint + '?access_token=' + accessToken;
    sendRequest(method, path, params, timeout)
      .then((answer) => {
        let json = JSON.parse(answer);
        if (typeof json['error'] != 'undefined')
          reject(new RequestError(json['error_description']));
        resolve(json);
      });
  });
}

module.exports = {

// --------------------------- AUTHENTICATION ----------------------------------

  // Attach a previously obtained access token to future queries
  setAccessToken: (token) => {
    if (typeof token != 'string')
      throw new TypeError('token must be a string');
    accessToken = token;
  },

  // Retrieve an access token object from known uid and secret
  authenticate: (uid, secret) => {
    if (typeof uid != 'string' || typeof secret != 'string')
      throw new TypeError('uid and secret must be strings');

    let params = {
      grant_type: 'client_credentials',
      client_id: uid,
      client_secret: secret
    };

    // Transform the params into a complete string
    let string = '';
    for (k in params)
      string += '&' + k + '=' + params[k];
    string = string.slice(1);

    return new Promise((resolve, reject) => {
      sendRequest('POST', '/oauth/token', string)
        .then((answer) => {
          let json = JSON.parse(answer);
          if (typeof json['error'] != 'undefined')
            reject(new RequestError(json['error_description']));
          resolve(json);
        });
    });
  },

// ----------------------------- ACHIEVEMENTS ----------------------------------

  // Get a list of all available achievements
  getAchievements: () => {
    return queryEndpoint('GET', '/v2/achievements');
  },

// ------------------------------- EVENTS --------------------------------------

  // Get a list of all available events
  getEvents: () => {
    return queryEndpoint('GET', '/v2/events');
  }

};

// When an API request fails
class RequestError extends Error {}
module.exports.RequestError = RequestError;

// When using an unknown method
class MethodError extends Error {}
module.exports.MethodError = MethodError;
