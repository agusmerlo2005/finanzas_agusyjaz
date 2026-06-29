# 💛 Jaz & Agus · Finanzas compartidas

App para que **Agustín y Jazmín** lleven juntos sus gastos, ahorros y metas.
Hecha con React + Vite + Tailwind + Recharts. Los datos se guardan en una
**planilla de Google** (que podés abrir/exportar como Excel cuando quieras).

---

## ⚡ Probarla YA (modo demo)

```bash
npm install
npm run dev
```

Abrí http://localhost:5173 → PIN **`1234`**.
Arranca con datos de ejemplo guardados en tu navegador. Todo funciona, pero
todavía no se comparte entre los dos. Para eso, conectá la planilla 👇

---

## 🔌 Paso 1 — Conectar la planilla (para que entren los dos)

1. Entrá a **[sheets.new](https://sheets.new)** y creá una planilla. Ponele un
   nombre, ej: `Finanzas Jaz y Agus`.
2. Arriba: **Extensiones → Apps Script**.
3. Borrá todo lo que haya y **pegá el contenido de `apps-script/Code.gs`**
   (está en este proyecto). Guardá (💾).
4. Botón azul **Implementar → Nueva implementación**.
   - Tipo (engranaje ⚙️): **Aplicación web**.
   - *Ejecutar como*: **Yo**.
   - *Quién tiene acceso*: **Cualquier persona**.
   - **Implementar**. Autorizá los permisos (es tu propia cuenta, dale "Permitir").
5. Copiá la **URL de la aplicación web** (termina en `/exec`).

> Las pestañas **Gastos**, **Ahorros** y **Metas** se crean solas la primera vez.

## 🔑 Paso 2 — Pegar la URL y elegir el PIN

Abrí `src/config.js` y completá:

```js
export const APPS_SCRIPT_URL = 'https://script.google.com/.../exec'  // ← tu URL
export const APP_PIN = '0000'   // ← el PIN que van a usar los dos
```

Guardá. Si el server estaba corriendo, recargá. Arriba debería decir
**"Conectado al Excel"** en verde. Listo: ahora lo que carga uno lo ve el otro. 🎉

---

## 🚀 Paso 3 — Subirlo a internet (Vercel, gratis)

Para usarlo desde el celular sin tener la compu prendida:

1. Subí esta carpeta a un repo de GitHub.
2. Entrá a **[vercel.com](https://vercel.com)** → *Add New → Project* → importá el repo.
3. Framework: **Vite** (lo detecta solo). Deploy.
4. Te queda una URL tipo `jaz-agus.vercel.app`. Guardenla como acceso directo
   en la pantalla de inicio del celu. 📱

> Recomendado: en Vercel → *Settings → Environment Variables* cargá
> `VITE_APPS_SCRIPT_URL` y `VITE_APP_PIN` en vez de dejarlos en `config.js`.

---

## 🛠️ Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta la app en local |
| `npm run build` | Compila para producción (`dist/`) |
| `npm run preview` | Previsualiza el build |

## 🎨 Personalizar

- **Categorías**: `src/lib/categories.js`
- **Nombres / moneda**: `src/config.js`
- **Foto**: reemplazá `src/assets/jaz.jpeg`
- **Colores**: variables en `src/index.css` (paleta sacada de la foto del lago 🏔️)

---

Hecho con 💛 para los dos.
