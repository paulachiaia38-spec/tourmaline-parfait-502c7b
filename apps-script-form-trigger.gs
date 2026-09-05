/**
 * ESTE ARCHIVO NO VA EN EL REPO DE NETLIFY.
 * Se pega en el editor de Apps Script del Google Form:
 *   Google Form → menú ⋮ (tres puntos) → Editor de secuencia de comandos
 *
 * Después hay que crear el trigger:
 *   Reloj (Activadores) → Añadir activador
 *   Función: onFormSubmit
 *   Origen del evento: Desde el formulario
 *   Tipo de evento: Al enviarse el formulario
 */

// Reemplazar por la URL real de tu sitio en Netlify
const NETLIFY_ENDPOINT = 'https://horkionceremonias.netlify.app/.netlify/functions/mark-complete';

// Debe coincidir EXACTO con la variable de entorno SHARED_SECRET en Netlify
const SHARED_SECRET = 'f4f1d25f7ade7a4e956f947d619d8de628553d6f295f4dda';

// Título exacto de la pregunta oculta donde viaja el token de sesión
const TOKEN_FIELD_TITLE = 'token_sesion';

// Título exacto de la pregunta donde viaja el nombre de la ceremonia (si la agregaste)
const CEREMONIA_FIELD_TITLE = 'Ceremonia';

function onFormSubmit(e) {
  const itemResponses = e.response.getItemResponses();

  let token = null;
  let ceremonia = null;
  const email = e.response.getRespondentEmail ? e.response.getRespondentEmail() : null;

  itemResponses.forEach(function (itemResponse) {
    const titulo = itemResponse.getItem().getTitle();
    if (titulo === TOKEN_FIELD_TITLE) {
      token = itemResponse.getResponse();
    }
    if (titulo === CEREMONIA_FIELD_TITLE) {
      ceremonia = itemResponse.getResponse();
    }
  });

  if (!token) {
    // Si no vino el token, no podemos correlacionar con el visitante que abrió el form.
    return;
  }

  const payload = {
    token: token,
    email: email,
    ceremonia: ceremonia,
    timestamp: new Date().toISOString(),
  };

  UrlFetchApp.fetch(NETLIFY_ENDPOINT, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-shared-secret': SHARED_SECRET,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
}
