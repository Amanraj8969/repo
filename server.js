const WebSocket = require('ws');
const express = require('express');

const app = express();
const server = app.listen(8080, () => console.log('Listening on port 8080'));
const wss = new WebSocket.Server({ server });

const updates = [
    { ApporderID: 4, priceType: 'MKT', price: 2, triggerPrice: null, productType: 'I', status: 'complete', exchange: 'NSE', symbol: 'IDEA' },
    { ApporderID: 5, priceType: 'MKT', price: 3, triggerPrice: null, productType: 'I', status: 'complete', exchange: 'NSE', symbol: 'RELIANCE' },
    { ApporderID: 6, priceType: 'LMT', price: 4, triggerPrice: null, productType: 'I', status: 'open', exchange: 'NSE', symbol: 'TATA' },
    { ApporderID: 7, priceType: 'LMT', price: 5, triggerPrice: null, productType: 'I', status: 'cancelled', exchange: 'NSE', symbol: 'BAJAJ' },
    { ApporderID: 8, priceType: 'MKT', price: 6, triggerPrice: 8, productType: 'I', status: 'complete', exchange: 'NSE', symbol: 'WIPRO' },
    { ApporderID: 9, priceType: 'LMT', price: 7, triggerPrice: null, productType: 'I', status: 'open', exchange: 'NSE', symbol: 'ONGC' }
];

wss.on('connection', (ws) => {
    console.log('Client connected');
    sendUpdates(ws);
});

function sendUpdates(ws) {
    let counter = 0;

    
    setTimeout(() => {
        ws.send(JSON.stringify(updates[counter]));
        console.log(`[${new Date().toISOString()}] Sent: ${JSON.stringify(updates[counter])}`);
        counter++;
    }, 1000);

    
    setTimeout(() => {
        for (let i = 0; i < 20; i++) {
            ws.send(JSON.stringify(updates[counter % updates.length]));
            console.log(`[${new Date().toISOString()}] Sent: ${JSON.stringify(updates[counter % updates.length])}`);
            counter++;
        }
    }, 2000);

   
    setTimeout(() => {
        for (let i = 0; i < 40; i++) {
            ws.send(JSON.stringify(updates[counter % updates.length]));
            console.log(`[${new Date().toISOString()}] Sent: ${JSON.stringify(updates[counter % updates.length])}`);
            counter++;
        }
    }, 3000);

   
    setTimeout(() => {
        for (let i = 0; i < 30; i++) {
            ws.send(JSON.stringify(updates[counter % updates.length]));
            console.log(`[${new Date().toISOString()}] Sent: ${JSON.stringify(updates[counter % updates.length])}`);
            counter++;
        }
    }, 5000);
}
