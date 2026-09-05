# Cómo activar el flujo de reserva (Google Form → Google Calendar)

## 1. Preparar el Google Form

1. Creá (o abrí) el formulario de reserva.
2. Agregá una pregunta de **Respuesta corta** con el título **exacto**: `token_sesion`.
   Ponele una aclaración como *"No completar, se llena automáticamente"* y no la marques obligatoria.
3. (Opcional pero recomendado) Agregá otra pregunta de Respuesta corta llamada **exactamente** `Ceremonia`, así queda registrado cuál eligió la pareja.
4. Con el formulario abierto: **⋮ → Obtener enlace para prerrellenar**. Completá cualquier texto en `token_sesion` y en `Ceremonia`, generá el enlace y copiá los dos `entry.XXXXXXXXX` que aparecen en la URL generada (uno por cada campo).
5. Copiá también la URL base del formulario (la que empieza con `https://docs.google.com/forms/d/e/.../viewform`).

## 2. Configurar el Google Calendar

1. En Google Calendar, creá una **Página de reserva de citas** (Appointment Schedule) con la disponibilidad que quieras ofrecer.
2. Abrí "Compartir" → copiá el enlace de reserva. El ID que va después de `/schedules/` es tu `TU_SCHEDULE_ID`.

## 3. Editar `index.html`

Buscá este bloque cerca del final del archivo y reemplazá los 4 valores:

```js
const FORM_BASE_URL = 'https://docs.google.com/forms/d/e/TU_FORM_ID/viewform';
const TOKEN_ENTRY_ID = 'entry.111111111';
const CEREMONIA_ENTRY_ID = 'entry.222222222';
const CALENDAR_SCHEDULE_URL = 'https://calendar.google.com/calendar/appointments/schedules/TU_SCHEDULE_ID?gv=true';
```

## 4. Configurar Apps Script (el "avisador")

1. Desde el Google Form: **⋮ → Editor de secuencia de comandos**.
2. Pegá el contenido de `apps-script-form-trigger.gs` (está en la raíz de este proyecto).
3. Reemplazá `NETLIFY_ENDPOINT` por `https://TU-SITIO-REAL.netlify.app/.netlify/functions/mark-complete`.
4. Reemplazá `SHARED_SECRET` por una cadena larga y aleatoria (por ejemplo, generada en https://www.uuidgenerator.net/).
5. Andá a **Activadores** (ícono de reloj a la izquierda) → **Añadir activador**:
   - Función: `onFormSubmit`
   - Origen del evento: Desde el formulario
   - Tipo de evento: Al enviarse el formulario
6. Guardá y autorizá los permisos que pida Google.

## 5. Configurar Netlify

1. En el dashboard de Netlify de tu sitio: **Site settings → Environment variables**.
2. Agregá `SHARED_SECRET` con el **mismo valor exacto** que pusiste en el Apps Script.
3. Verificá que el deploy incluya `package.json` (para instalar `@netlify/blobs`) y la carpeta `netlify/functions/`. Netlify las detecta y despliega solas.

## 6. Probar

1. Entrá a tu web, elegí una ceremonia, bajá a "Reserva tu Fecha" y hacé clic en **Completar formulario**.
2. Completá el formulario y enviálo.
3. En unos segundos (máximo 3), la web debería desbloquear el calendario automáticamente, sin recargar la página.

### Si algo no funciona
- Revisá en el Google Form que el título del campo oculto sea **exactamente** `token_sesion` (mayúsculas/espacios importan).
- Mirá los logs de la función en Netlify: **Functions → mark-complete / check-status → ver logs**.
- Mirá las "Ejecuciones" del Apps Script (ícono de reloj → Ejecuciones) para ver si el POST a Netlify falló.
