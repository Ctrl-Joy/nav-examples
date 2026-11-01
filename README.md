# NAV examples

Small apps to try NAV with.

| Folder | What it shows | How to deploy |
|---|---|---|
| `hello-world/` | The smallest web service: no dependencies | New > Web Service, this repo, root directory `hello-world` |
| `hello-postgres/` + `nav.yaml` | A web service with its own Postgres database, linked by a blueprint | New > Blueprint, this repo |

Both listen on `$PORT` and answer `/healthz` for health checks.
