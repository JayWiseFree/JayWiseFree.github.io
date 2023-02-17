// Initial websocketclient creation, using the bybit-api node.js package
//const { WebsocketClient } = require('bybit-api');

// test of modified websocketclient creation, so I can pack this using browserify
const WebsocketClient = require('bybit-api').WebsocketClient;

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

const ws = new WebsocketClient(wsConfig);

ws.subscribe('publicTrade.BTCUSDT');

// Listen to events coming from websockets. This is the primary data source
// ws.on('update', (data) => {
//     console.log('update', data);
// });

// Test outputting only specific data points.
// ws.on('update', (data) => {
//   const side = data.data[0].S;
//   const volume = data.data[0].v;
//   const price = data.data[0].p;
//   console.log('Direction:', side, 'Trade price:', price, 'Trade quantity:', volume);
// });

// Test if data is array with one object
// ws.on('update', (data) => {
//   if ( Array.isArray(data) ) {
//     console.log('True');
//   } else {
//     console.log('False');
//   }
// })

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


//grab correct elements on received payload -- THIS WORKS (Use Case: Creating and Updating the Recent Trades Tracker)
// ws.on('update', (data) => {
//   const side = data.data[0].S;
//   const volume = data.data[0].v;
//   const price = data.data[0].p;
//   trades.unshift({side, volume, price});

//   // Only keep up to 30 trades
//   if ( trades.length > 30 ) {
//     trades.pop();
//   }

//   // Update the HTML table
//   table.innerHTML = trades.map((trade) => {
//     return `
//       <tr>
//         <td>${trade.side}</td>
//         <td>${trade.volume}</td>
//         <td>${trade.price}</td>
//       </tr>
//     `;
//   }).join('');
// });

// test updating the html table
const table = document.querySelector('#trade-table tbody');
const table2 = document.querySelector('#total-table tbody')
const trades = [];
const strengths = [];

const numBuys = document.querySelector('#numBuys');
const volBuys = document.querySelector('#volBuys');
const numSells = document.querySelector('#numSells');
const volSells = document.querySelector('#volSells');

// declare mutable variables to store sum totals of trade tracker in
// 1 minute time frame
let totalBuys = 0;
let totalSells = 0;
let volumeBuys = 0;
let volumeSells = 0;

// 5 minute time frame
let totalBuys5 = 0;
let totalSells5 = 0;
let volumeBuys5 = 0;
let volumeSells5 = 0;

// 15 minute time frame
let totalBuys15 = 0;
let totalSells15 = 0;
let volumeBuys15 = 0;
let volumeSells15 = 0;

// 30 minute time frame
let totalBuys30 = 0;
let totalSells30 = 0;
let volumeBuys30 = 0;
let volumeSells30 = 0;

// 1 hour time frame
let totalBuys60 = 0;
let totalSells60 = 0;
let volumeBuys60 = 0;
let volumeSells60 = 0;

// 4 hour time frame
let totalBuys240 = 0;
let totalSells240 = 0;
let volumeBuys240 = 0;
let volumeSells240 = 0;

// 12 hour time frame
let totalBuys720 = 0;
let totalSells720 = 0;
let volumeBuys720 = 0;
let volumeSells720 = 0;

// 1d time frame
let totalBuys1440 = 0;
let totalSells1440 = 0;
let volumeBuys1440 = 0;
let volumeSells1440 = 0;

// function to reset buys and sells every minute
// time interval for one minute in milliseconds
const resetInterval1m = 60 * 1000;
const resetInterval5m = 300 * 1000;
const resetInterval15m = 900 * 1000;
const resetInterval30m = 1800 * 1000;
const resetInterval60m = 3600 * 1000;
const resetInterval240m = 14400 * 1000;
const resetInterva720m = 43200 * 1000;
const resetInterva1440m = 86400 * 1000;


// function to reset values of buys/sells and volume
const resetValues = () => {
  setInterval(() => {
    totalBuys = 0; totalSells = 0; volumeBuys = 0; volumeSells = 0;
  }, 60 * 1000 );

  setInterval(() => {
    totalBuys5 = 0; totalSells5 = 0; volumeBuys5 = 0; volumeSells5 = 0;
  }, 300 * 1000 );

  setInterval(() => {
    totalBuys15 = 0; totalSells15 = 0; volumeBuys15 = 0; volumeSells15 = 0;
  }, 900 * 1000 );

  setInterval(() => {
    totalBuys30 = 0; totalSells30 = 0; volumeBuys30 = 0; volumeSells30 = 0;
  }, 1800 * 1000 );

  setInterval(() => {
    totalBuys60 = 0; totalSells60 = 0; volumeBuys60 = 0; volumeSells60 = 0;
  }, 3600 * 1000 );

  setInterval(() => {
    totalBuys240 = 0; totalSells240 = 0; volumeBuys240 = 0; volumeSells240 = 0;
  }, 14400 * 1000 );

  setInterval(() => {
    totalBuys720 = 0; totalSells720 = 0; volumeBuys720 = 0; volumeSells720 = 0;
  }, 43200 * 1000 );

  setInterval(() => {
    totalBuys1440 = 0; totalSells1440 = 0; volumeBuys1440 = 0; volumeSells1440 = 0;
  }, 86400 * 1000 );
    
}

// call restValues() function
resetValues();

// set interval to reset buys/sells and volume
// setInterval(resetValues, resetInterval1m);


// test new feature
// ws.on('update', (data) => {
//   const side = data.data[0].S;
//   const volume = data.data[0].v;
//   const price = data.data[0].p;
//   if ( side === "Buy" ) {
//     totalBuys += 1;
//     volumeBuys += Number(volume);
//   } else if ( side === "Sell" ) {
//     totalSells += 1;
//     volumeSells += Number(volume);
//   };
//   trades.unshift({side, volume, price});

//   // Only keep up to 30 trades
//   if ( trades.length > 30 ) {
//     trades.pop();
//   }

//   // Update the HTML table
//   table.innerHTML = trades.map((trade) => {
//     return `
//       <tr>
//         <td>${trade.side}</td>
//         <td>${trade.volume}</td>
//         <td>${trade.price}</td>
//       </tr>
//     `;
//   }).join('');

//   // Update the total trades HTML table
//   numBuys.innerHTML = totalBuys;
//   numSells.innerHTML = totalSells;
//   volBuys.innerHTML = volumeBuys.toFixed(2);
//   volSells.innerHTML = volumeSells.toFixed(2);
//   // console.log(`${volumeBuys}`);
//   // console.log(`${volumeSells}`);
// }); 

// test using the map method to insert strength tracker
ws.on('update', (data) => {
  const side = data.data[0].S;
  const volume = data.data[0].v;
  const price = data.data[0].p;
  if ( side === "Buy" ) {
    totalBuys += 1; totalBuys5 += 1; totalBuys15 += 1; totalBuys30 += 1; totalBuys60 += 1; totalBuys240 += 1; totalBuys720 += 1; totalBuys1440 += 1;
    volumeBuys += Number(volume); volumeBuys5 += Number(volume); volumeBuys15 += Number(volume); volumeBuys30 += Number(volume); volumeBuys60 += Number(volume); volumeBuys240 += Number(volume); volumeBuys720 += Number(volume); volumeBuys1440 += Number(volume);
  } else if ( side === "Sell" ) {
    totalSells += 1; totalSells5 += 1; totalSells15 += 1; totalSells30 += 1; totalSells60 += 1; totalSells240 += 1; totalSells720 += 1; totalSells1440 += 1;
    volumeSells += Number(volume); volumeSells5 += Number(volume); volumeSells15 += Number(volume); volumeSells30 += Number(volume); volumeSells60 += Number(volume); volumeSells240 += Number(volume); volumeSells720 += Number(volume); volumeSells1440 += Number(volume);
  };
  trades.unshift({side, volume, price});
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.pop();
  strengths.unshift({totalBuys, volumeBuys, totalSells, volumeSells,totalBuys5, volumeBuys5, totalSells5, volumeSells5,totalBuys15, volumeBuys15, totalSells15, volumeSells15,totalBuys30, volumeBuys30, totalSells30, volumeSells30,totalBuys60, volumeBuys60, totalSells60, volumeSells60,totalBuys240, volumeBuys240, totalSells240, volumeSells240,totalBuys720, volumeBuys720, totalSells720, volumeSells720,totalBuys1440, volumeBuys1440, totalSells1440, volumeSells1440})

  // Only keep up to 30 trades
  if ( trades.length > 30 ) {
    trades.pop();
  }

  // Update the HTML table
  table.innerHTML = trades.map(( trade ) => {
    return `
      <tr>
        <td>${trade.side}</td>
        <td>${trade.volume}</td>
        <td>${trade.price}</td>
      </tr>
    `;
  }).join('');

  // Update the total trades HTML table
  table2.innerHTML = strengths.map(( strength ) => {
    return `
      <tr>
        <td>1m</td>
        <td>${strength.totalBuys}</td>
        <td>${strength.volumeBuys.toFixed(3)}</td>
        <td>${strength.totalSells}</td>
        <td>${strength.volumeSells.toFixed(3)}</td>
      </tr>
      <tr>
        <td>5m</td>
        <td>${strength.totalBuys5}</td>
        <td>${strength.volumeBuys5.toFixed(3)}</td>
        <td>${strength.totalSells5}</td>
        <td>${strength.volumeSells5.toFixed(3)}</td>
    </tr>
    <tr>
      <td>15m</td>
      <td>${strength.totalBuys15}</td>
      <td>${strength.volumeBuys15.toFixed(3)}</td>
      <td>${strength.totalSells15}</td>
      <td>${strength.volumeSells15.toFixed(3)}</td>
    </tr>
    <tr>
      <td>30m</td>
      <td>${strength.totalBuys30}</td>
      <td>${strength.volumeBuys30.toFixed(3)}</td>
      <td>${strength.totalSells30}</td>
      <td>${strength.volumeSells30.toFixed(3)}</td>
    </tr>
    <tr>
      <td>1HR</td>
      <td>${strength.totalBuys60}</td>
      <td>${strength.volumeBuys60.toFixed(3)}</td>
      <td>${strength.totalSells60}</td>
      <td>${strength.volumeSells60.toFixed(3)}</td>
    </tr>
    <tr>
      <td>4HR</td>
      <td>${strength.totalBuys240}</td>
      <td>${strength.volumeBuys240.toFixed(3)}</td>
      <td>${strength.totalSells240}</td>
      <td>${strength.volumeSells240.toFixed(3)}</td>
    </tr>
    <tr>
      <td>12HR</td>
      <td>${strength.totalBuys720}</td>
      <td>${strength.volumeBuys720.toFixed(3)}</td>
      <td>${strength.totalSells720}</td>
      <td>${strength.volumeSells720.toFixed(3)}</td>
    </tr>
    <tr>
      <td>1D</td>
      <td>${strength.totalBuys1440}</td>
      <td>${strength.volumeBuys1440.toFixed(3)}</td>
      <td>${strength.totalSells1440}</td>
      <td>${strength.volumeSells1440.toFixed(3)}</td>
    </tr>
    `;
  }).join('');
}); 

// Theme Toggle - Light/Dark
const themeToggle = document.querySelector('#theme-toggle');
const body = document.querySelector('body');

themeToggle.addEventListener('click', function() {
  body.classList.toggle('dark');
});

// next steps
// 1. write logic that will reset each counter every set time period.
//  a. i could do it the way i'm doing it, by creating a seperate variable for each time instance OR I could reset the HTML output every five minutes...

// iterate next steps
// 1. create a function that sums up total buying pressure within tranches: 1m, 10m, 60m, 240m, day, week
//    a. add if rules to current script pulling payload data that incremenet a const integer variable
// 2. create html table to push the data too and push the data there
// 3. style the tables so they can appear next to each other with no conflict


// DEPRECATED CODE

// test incrementing Strength Tracker for total buys/sells - the issue here was not using Number in front of volume.
// ws.on('update', (data) => {
//   const side = data.data[0].S;
//   const volume = data.data[0].v;
//   const price = data.data[0].p;
//   if ( side === "Buy" ) {
//     totalBuys += 1;
//     volBuys += volume;
//   } else if ( side === "Sell" ) {
//     totalSells += 1;
//     volSells += volume;
//   }
// });