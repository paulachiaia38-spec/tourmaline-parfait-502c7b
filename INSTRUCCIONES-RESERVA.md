# Cómo activar el flujo de reserva (Google Form → Google Calendar)

**Ya está todo cargado y listo:**
- Google Form: `1FAIpQLSdWRX6ZYzjHfC_2w82l_2jGh1_tsdVwGW3_-VMIxDj4oWr3tw`
- Campo token: `entry.1736996056`
- Agenda de citas de Calendar: ya cargada en `index.html`
- Sitio Netlify: `https://horkionceremonias.netlify.app`
- `SHARED_SECRET` ya generado y puesto en `apps-script-form-trigger.gs`

**Lo único que falta hacer vos:**

## 1. Subir estos archivos a tu repo de GitHub
Reemplazá los archivos existentes con los de este ZIP (`index.html`, `netlify.toml`, `package.json`, y agregá la carpeta `netlify/functions/`). Hacé commit y push — Netlify redeploya solo.

## 2. Pegar el Apps Script en el Google Form
1. Desde el Google Form: **⋮ → Apps Script**.
2. Borrá lo que haya en el editor y pegá TODO el contenido de `apps-script-form-trigger.gs` (ya viene con tu URL y el secreto cargados, no hay que tocar nada).
3. Guardá (ícono de disquete o Ctrl+S).
4. A la izquierda, ícono del **reloj (Activadores)** → **Añadir activador**:
   - Función: `onFormSubmit`
   - Origen del evento: **Desde el formulario**
   - Tipo de evento: **Al enviarse el formulario**
5. Guardá. Te va a pedir autorizar permisos de tu cuenta de Google — aceptá.

## 3. Agregar la variable de entorno en Netlify
1. Entrá al dashboard de tu sitio en Netlify → **Site configuration → Environment variables**.
2. Agregá una variable:
   - Key: `SHARED_SECRET`
   - Value: `f4f1d25f7ade7a4e956f947d619d8de628553d6f295f4dda`
3. Guardá y volvé a desplegar el sitio (Netlify suele pedir un "Trigger deploy" para que tome la nueva variable).

## 4. Probar todo el flujo
1. Entrá a `https://horkionceremonias.netlify.app`, bajá hasta "Reserva tu Fecha".
2. Hacé clic en "Completar formulario", llenalo como si fueras un visitante y enviálo.
3. Volvé a la pestaña de tu web (no hace falta recargar): en unos segundos el calendario debería desbloquearse solo y mostrar tu agenda de citas real.
4. Elegí un horario de prueba y confirmá — debería aparecer como evento en tu Google Calendar real.

### Si algo no funciona
- Revisá los logs de la función en Netlify: **Functions → mark-complete → ver logs**.
- Revisá las "Ejecuciones" del Apps Script (ícono del reloj → Ejecuciones) para ver si el aviso a Netlify falló o dio error de autorización.
- Confirmá que el `SHARED_SECRET` sea idéntico (sin espacios de más) en Netlify y en el Apps Script.

