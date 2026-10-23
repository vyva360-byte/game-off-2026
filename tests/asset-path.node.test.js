import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resolveAssetPath } from '../scripts/asset-path.js';

const root = path.resolve('src');
test('malformed encodings and NUL are rejected without crashing', () => {
  for (const input of ['/%', '/%E0%A4%A', '/%00']) {
    assert.equal(resolveAssetPath(root, input).status, 400);
  }
});
test('traversal including sibling-prefix and encoded Windows separators is rejected', () => {
  for (const input of ['/../package.json', '/../src-secrets/key', '/%2e%2e/package.json', '/..%5cpackage.json']) {
    assert.equal(resolveAssetPath(root, input).status, 403, input);
  }
});
test('root, encoded filenames, and query strings resolve within src', () => {
  assert.equal(resolveAssetPath(root, '/?v=1').filePath, path.join(root, 'index.html'));
  assert.equal(resolveAssetPath(root, '/hello%20world.js').filePath, path.join(root, 'hello world.js'));
  assert.equal(resolveAssetPath(root, '/core/math.js').status, 200);
});
