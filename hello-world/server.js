// The smallest NAV web service: no dependencies, listens on $PORT.
const http = require('node:http');

const port = Number(process.env.PORT || 3000);

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hello from NAV!</title>
  <style>
    :root { color-scheme: dark; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b0b0f; color: #f4f4f6;
      font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
    main { text-align: center; padding: 24px; }
    h1 { font-size: clamp(2rem, 6vw, 3.5rem); margin: 0 0 8px; letter-spacing: -0.02em; }
    h1 span { color: #8b5cf6; }
    p { color: #a1a1aa; margin: 4px 0; }
    code { color: #c4b5fd; }
  </style>
</head>
<body>
  <main>
    <h1>Hello from <span>NAV</span>!</h1>
    <p>This service was built from Git and deployed by NAV.</p>
    <p>Service <code>${process.env.NAV_SERVICE_NAME || 'local'}</code> · commit <code>${(process.env.NAV_GIT_COMMIT || 'dev').slice(0, 7)}</code></p>
  </main>
</body>
</html>`;

http
  .createServer((req, res) => {
    if (req.url === '/healthz') return res.end('ok');
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(page);
  })
  .listen(port, () => console.log(`hello-world listening on ${port}`));
