# Bind your front-end app to your backend api in development

In web devlopment, a way to allow the user to interact with your service is to provide him a client, an html/css/js page, this client represente the User Interface with your backend server. On certain actions of the user on the user interface (click, keypress, ...) the client will send a request to the backend service representing the user action.

Most of the time, we want our client to be served on the same server as our backend, for example: the root of our site provide the client and some routes of our site are used to listen to the user actions (sometimes prefixed by /api/).

For example:

```
/users
/posts
/api/messages
```

In your code, while developing, you want your javascript to request the same origin that provide your client, most of the time you want it not to be hardcoded:

```js
// Bad
fetch('https://mysite.com/users');

// Good
fetch('/users');
```

While developing, most of the time you will use a dev server which provides hot reload, this approach provoke a problem: since this is a server, your javascript will request your backend server on your dev server:

If your backend runs on port 3000 and your front-end dev server runs on 4200, using the good js approach above, your request will looks like this: http://127.0.0.1:4200/users.

Since this is not what we want, front-end frameworks provides a way to redirect the request of your front-end app to the adress of your backend server, and this in dev mode only. This is called a proxy.

If you are using React with create-react-app:

Install http-proxy-middleware:
```
npm i http-proxy-middleware
```

Create a setupProxy.js in src/:

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
    }),
  );
};

```

If you are using Nx, put a proxy.config.json at the root of your app:

```json
{
  // /api requests will be mapped on http://localhost:3000/api
  "/api": {
      "target": "http://localhost:3000",
      "changeOrigin": true
  },
  // If you are using socket.io
  "/socket.io": {
      "target": "ws://localhost:3000",
      "ws": true
  }
}
```

*note:* If you are using socket.io with namespaces, you don't need to register your namespaces in the proxy.conf.json, socket.io process it himself.