# Mystery Word

A small Express guessing game for testing service deployments.

```sh
npm install
npm start
```

The service listens on `PORT` when set, or port `3000` by default. Configure it
as a **service** in PaaS with container port `3000`; it does not need a static-site
output directory. The game works at `/` and `/game` (the deployed PaaS path).
Set `BASE_PATH` to a different prefix if you change the application's PaaS path.
The load balancer forwards the prefix unchanged, so the game keeps stylesheet,
form, and restart links under the current mount path. The root remains available
for health checks.

Words are bundled in `data/words.txt`, so Linux containers do not need a system
dictionary at `/usr/share/dict/words`. Add one alphabetic word per line to change
the list. Templates use the existing case-sensitive `Views` directory. Dictionary,
template, and static file paths are resolved relative to the application files.

Run the startup, homepage, styles, and guess regression checks with `npm test`.
