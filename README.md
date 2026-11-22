# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Local API and Google sign-in

Create `.env.local` from `.env.example` if it does not exist yet, and set `VITE_GOOGLE_CLIENT_ID` to a Google OAuth 2.0 web client ID. Configure `http://localhost:5173` as an authorized JavaScript origin in Google Cloud. Put the same client ID in `GOOGLE_CLIENT_ID` in the backend `.env`, then restart both development servers. Google sign-in is hidden until the frontend client ID is configured.

```bash
npm run dev
```

Frontend `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

The backend accepts Google sign-in only for verified accounts from its allowed email domains; see the backend `UsuarioService` for the current domain policy.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
