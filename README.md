# Vault

## Requirements

* [Node.js] to build the frontend and run the backend
* A [PostgreSQL] server
* A [secure context] for the app to run in, as this is required by the [Web Crypto API]

## Installation

1. Clone the repository
1. Run `npm install` to install all dependencies
1. Run `npm run build` to generate the production build
1. Edit `config.json` to specify which port the backend should run on and how to access the database
1. If you changed the port, you'll also have to change the `"proxy"` option in `frontend/package.json`

## Start dev server

1. Run `npm run start-dev`
1. Make sure to open the app in a [secure context] (e.g., [http://localhost:3000](http://localhost:3000))

## Start production server

1. Run an HTTPS server to ensure a [secure context]
1. Configure it to serve files from `frontend/build/`
1. Configure it to proxy requests for `/api/` to the backend (default port of 14151)
1. Run `npm start` to start the backend

[Node.js]: https://nodejs.org
[PostgreSQL]: https://www.postgresql.org/
[secure context]: https://developer.mozilla.org/docs/Web/Security/Secure_Contexts
[Web Crypto API]: https://developer.mozilla.org/docs/Web/API/Web_Crypto_API