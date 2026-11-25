# PokéStore Frontend

Aplicación React con Vite. En desarrollo consume la API Spring Boot en `http://localhost:8000`.

## Requisitos

- Node.js `20.19+` o `22.12+`.
- npm (incluido con Node.js).
- Backend PokéStore iniciado y accesible en `http://localhost:8000`.

## Instalar dependencias

Ejecuta desde la raíz de este repositorio. `npm ci` instala las versiones del `package-lock.json`.

### Linux

```bash
npm ci
cp .env.example .env.local
```

### Windows (PowerShell)

```powershell
npm ci
Copy-Item .env.example .env.local
```

No es obligatorio crear `.env.local` para el uso local predeterminado. Si necesitas cambiar la URL de la API o habilitar Google Sign-In, edítalo:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=
```

Para Google Sign-In, configura un OAuth Client ID tipo aplicación web, agrega `http://localhost:5173` como origen autorizado y usa el mismo Client ID en `VITE_GOOGLE_CLIENT_ID` del frontend y `GOOGLE_CLIENT_ID` del backend. Reinicia ambos servidores después de cambiarlo.

## Ejecutar en desarrollo

### Linux

```bash
npm run dev
```

### Windows (PowerShell o CMD)

```powershell
npm run dev
```

Abre <http://localhost:5173>. Detén Vite con `Ctrl+C`.

## Ejecutar backend y frontend

Primero inicia el backend Spring Boot y MySQL según las instrucciones de [PokéStore Backend Spring Boot](https://github.com/jrodriguezluna/poke-store-backend-sb#readme). En Windows, ejecuta cada servidor en una terminal distinta. En Linux, el README del backend incluye `dev.sh` para iniciar ambos repositorios juntos.

Los vendedores acceden solo al catálogo y a la vista de órdenes (lista y detalle); no ven carrito, perfil ni herramientas administrativas. Un administrador asigna el rol desde el panel de usuarios. Tras cambiar un rol, la cuenta debe iniciar sesión de nuevo para cargar los permisos correspondientes.

## Otros comandos

```bash
npm run build
npm run lint
npm run test:coverage
```
