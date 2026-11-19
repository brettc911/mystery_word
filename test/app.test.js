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
    const home = await fetch(base);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /Mystery Word/);
    const styles = await fetch(`${base}/style/master.css`);
    assert.equal(styles.status, 200);
    assert.match(await styles.text(), /\{/);
    const guess = await fetch(`${base}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: home.headers.get('set-cookie').split(';')[0],
      },
      body: 'inputLetter=a',
    });
    assert.equal(guess.status, 200);
    assert.match(await guess.text(), /Mystery Word/);
  } finally {
    process.chdir(originalDirectory);
    if (server) await new Promise(resolve => server.close(resolve));
  }
});
