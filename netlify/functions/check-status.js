// netlify/functions/check-status.js
//
// La web hace polling a este endpoint:
//   GET /.netlify/functions/check-status?token=XXXX

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = event.queryStringParameters && event.queryStringParameters.token;

  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing token' }) };
  }

  const store = getStore({
    name: 'form-tokens',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN,
  });
  const data = await store.get(token, { type: 'json' });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      completed: !!(data && data.completed),
      completedAt: data ? data.completedAt : null,
    }),
  };
};
