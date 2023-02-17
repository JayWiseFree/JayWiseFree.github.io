// create websocket variable that pulls bybit-api functionality
const WebsocketClient = require('bybit-api').WebsocketClient;

// set variables for ease of calling the bybit-api
const API_KEY = '';
const PRIVATE_KEY = '';

const wsConfig = {
    key: API_KEY,
    secret: PRIVATE_KEY,
    // market: 'linear',
    // market: 'inverse',
    // market: 'spot',
    // market: 'spotv3',
    // market: 'usdcOption',
    // market: 'usdcPerp',
    market: 'unifiedPerp',
    // market: 'unifiedOption',
    // how long to wait (in ms) before deciding the connection should be terminated & reconnected
    pongTimeout: 1000,
    // how often to check (in ms) that WS connection is still alive
    pingInterval: 10000,
    // how long to wait before attempting to reconnect (in ms) after connection is closed
    reconnectTimeout: 500,
}

// create a websocket connection with above configurations and subscribe to it
const ws = new WebsocketClient(wsConfig);

ws.subscribe('publicTrade.BTCUSDT');

// Optional: Listen to connection close event. Unexpected connection closes are automatically reconnected.
ws.on('close', () => {
    console.log('connection closed');
});

// Optional: Listen to websocket connection open event (automatic after subscribing to one or more topics)
ws.on('open', ({ wsKey, event }) => {
    console.log('connection open for websocket with ID: ' + wsKey);
});

// Optional: Listen to responses to websocket queries (e.g. the response after subscribing to a topic)
ws.on('response', (response) => {
    console.log('response', response);
});

// Optional: Listen to raw error events. Recommended.
ws.on('error', (err) => {
    console.error('error', err);
});

// Listen to events coming from websockets. This is the primary data source
// ws.on('update', (data) => {
//     console.log('update', data);
// });

// Test outputting only specific data points.
ws.on('update', (data) => {
  const side = data.data[0].S;
  const volume = data.data[0].v;
  const price = data.data[0].p;

  //push data into object
  priceChart.data.labels.push(volume);
  priceChart.data.datasets[0].data.push(price);

  const maxDataPoints = 20;

  if ( priceChart.data.labels.length > maxDataPoints ) {
      priceChart.data.labels.shift();
      priceChart.data.datasets[0].data.shift();
  };

  console.log(priceChart.data.labels.length);
  console.log(priceChart.data.datasets[0].data.length);
//   console.log('Direction:', side, 'Trade price:', price, 'Trade quantity:', volume);
});

//create test object
const priceChart = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'BTC/USDT PERP',
            data: [],
            borderColor: 'blue'
        }]
    }
};

