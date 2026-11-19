const assert = require('node:assert/strict');
const { test } = require('node:test');
const { tmpdir } = require('node:os');

test('ships a nonempty list of playable words without a system dictionary', () => {
  const words = require('../modules/words');
  assert.ok(words.length > 0);
  assert.ok(words.every(word => /^[a-z]+$/.test(word)));
});

test('serves the game and styles on Linux independently of the working directory', async () => {
  const originalDirectory = process.cwd();
  let server;
  try {
    process.chdir(tmpdir());
    const app = require('../index');
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const prefix of ['', '/game']) {
      const home = await fetch(`${base}${prefix}/`);
      assert.equal(home.status, 200, `Homepage at ${prefix || '/'}`);
      const html = await home.text();
      assert.match(html, /Mystery Word/);
      assert.ok(html.includes(`action="${prefix}/submit"`));
      assert.ok(html.includes(`href="${prefix}/style/master.css"`));
      if (prefix) assert.equal((await fetch(`${base}${prefix}`)).status, 200);
      const styles = await fetch(`${base}${prefix}/style/master.css`);
      assert.equal(styles.status, 200);
      assert.match(await styles.text(), /\{/);
      const guess = await fetch(`${base}${prefix}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: home.headers.get('set-cookie').split(';')[0],
        },
        body: 'inputLetter=a',
      });
      assert.equal(guess.status, 200);
      assert.match(await guess.text(), /Mystery Word/);
    }
  } finally {
    process.chdir(originalDirectory);
    if (server) await new Promise(resolve => server.close(resolve));
  }
});
