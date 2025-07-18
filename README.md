# Tienda Automática

Proyecto fullstack con React (frontend) y Node.js/Express + SQLite (backend).

## Estructura

```
proyectos4/
  ├── client/   # Frontend React
  ├── server/   # Backend Node.js/Express + SQLite
  ├── package.json, README.md, etc.
```

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/tienda-automatica.git
   cd tienda-automatica
   ```

2. Instala dependencias:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

## Cómo correr el proyecto en desarrollo

- **Backend:**
  ```bash
  cd server
  npm start
  ```
- **Frontend:**
  ```bash
  cd client
  npm start
  ```

- El frontend estará en http://localhost:3000
- El backend en http://localhost:5000

## Despliegue

- Puedes desplegar el frontend en [Vercel](https://vercel.com/) o [Netlify](https://netlify.com/).
- Puedes desplegar el backend en [Render](https://render.com/) o [Railway](https://railway.app/).

## Notas
- El archivo `server/database.sqlite` se crea automáticamente.
- El backend inserta productos de ejemplo si la base de datos está vacía.
- No subas archivos sensibles ni la base de datos a GitHub.

---
¡Listo para usar y compartir! 