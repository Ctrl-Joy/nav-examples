// A NAV web service backed by NAV Postgres: counts visits in a table. DATABASE_URL comes from nav.yaml.
const http = require('node:http');
const { Pool } = require('pg');

const port = Number(process.env.PORT || 3000);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function setup() {
  await pool.query('CREATE TABLE IF NOT EXISTS visits (id bigserial PRIMARY KEY, at timestamptz NOT NULL DEFAULT now())');
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function page(body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NAV + Postgres</title>
  <style>
    :root { color-scheme: dark; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b0b0f; color: #f4f4f6;
      font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
    main { text-align: center; padding: 24px; }
    h1 { font-size: clamp(2rem, 6vw, 3.25rem); margin: 0 0 8px; letter-spacing: -0.02em; }
    h1 span { color: #8b5cf6; }
    .n { font-size: 3rem; font-weight: 700; color: #c4b5fd; margin: 12px 0; }
    p { color: #a1a1aa; margin: 4px 0; }
  </style>
</head>
<body><main>${body}</main></body>
</html>`;
}

http
  .createServer(async (req, res) => {
    if (req.url === '/healthz') return res.end('ok');
    if (req.url !== '/') { res.statusCode = 404; return res.end('not found'); }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    try {
      await pool.query('INSERT INTO visits DEFAULT VALUES');
      const { rows } = await pool.query('SELECT count(*)::int AS n, version() AS v FROM visits');
      res.end(page(`<h1>Hello from <span>NAV</span> + Postgres!</h1>
        <div class="n">${rows[0].n}</div>
        <p>visits stored in your NAV database</p>
        <p>${esc(rows[0].v.split(' on ')[0])}</p>`));
    } catch (err) {
      res.statusCode = 500;
      res.end(page(`<h1>Database not reachable</h1><p>${esc(err.message)}</p>`));
    }
  })
  .listen(port, async () => {
    await setup().catch((err) => console.error('setup failed:', err.message));
    console.log(`hello-postgres listening on ${port}`);
  });
