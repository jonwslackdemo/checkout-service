'use strict';

const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = [250, 1000, 2500];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetriable(err) {
  if (!err) return false;
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') return true;
  if (typeof err.statusCode === 'number' && err.statusCode >= 500) return true;
  return false;
}

async function capturePayment(client, order) {
  let lastError;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await client.capture({
        orderId: order.id,
        amount: order.total,
        currency: order.currency,
      });
      return result;
    } catch (err) {
      lastError = err;
      if (!isRetriable(err) || attempt === MAX_RETRIES - 1) throw err;
      await sleep(RETRY_BACKOFF_MS[attempt]);
    }
  }
  throw lastError;
}

module.exports = { capturePayment, isRetriable };
