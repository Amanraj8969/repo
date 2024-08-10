const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

let orders = {};
let aggregationTimeout;

ws.on('message', (data) => {
    const orderUpdate = JSON.parse(data);
    if (isRedundant(orderUpdate)) {
        console.log(`[${new Date().toISOString()}] Filtered redundant update: ${data}`);
        return;
    }
    determineAction(orderUpdate);
    logUpdate(orderUpdate);
    aggregateAndSend(orderUpdate);
});

function isRedundant(update) {
    const key = generateKey(update);
    if (orders[key]) {
        return true;
    }
    orders[key] = update;
    return false;
}

function generateKey(update) {
    return `${update.ApporderID}-${update.price}-${update.triggerPrice}-${update.priceType}-${update.productType}-${update.status}-${update.exchange}-${update.symbol}`;
}

function determineAction(update) {
    const { priceType, status } = update;

    if (priceType === 'MKT' && status === 'complete') {
        console.log(`[${new Date().toISOString()}] Action: placeOrder`);
    } else if (priceType === 'LMT' && status === 'open') {
        console.log(`[${new Date().toISOString()}] Action: placeOrder`);
    } else if ((priceType === 'SL-LMT' || priceType === 'SL-MKT') && status === 'pending') {
        console.log(`[${new Date().toISOString()}] Action: placeOrder`);
    } else if (status === 'cancelled') {
        console.log(`[${new Date().toISOString()}] Action: cancelOrder`);
    } else {
        console.log(`[${new Date().toISOString()}] Action: No action required`);
    }
}

function logUpdate(update) {
    console.log(`[${new Date().toISOString()}] Received: ${JSON.stringify(update)}`);
}

function aggregateAndSend(update) {
    if (aggregationTimeout) {
        clearTimeout(aggregationTimeout);
    }

    aggregationTimeout = setTimeout(() => {
        console.log(`[${new Date().toISOString()}] Sending update: ${JSON.stringify(update)}`);
    }, 1000);
}

ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
});
