// netlify/functions/mark-complete.js
//
// A este endpoint lo llama el Google Apps Script del formulario (no el navegador),
// así que no hace falta configurar CORS.
//
// URL final una vez deployado:
//   https://tu-sitio.netlify.app/.netlify/functions/mark-complete

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Protección simple: un secreto compartido entre el Apps Script y esta función.
  // Configuralo en Netlify: Site settings -> Environment variables -> SHARED_SECRET
  const auth = event.headers['x-shared-secret'];
  if (auth !== process.env.SHARED_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { token, email, ceremonia, timestamp } = payload;

  if (!token) {
    return { statusCode: 400, body: 'Missing token' };
  }

  const store = getStore({
    name: 'form-tokens',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN,
  });

  await store.setJSON(token, {
    completed: true,
    email: email || null,
    ceremonia: ceremonia || null,
    completedAt: timestamp || new Date().toISOString(),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
