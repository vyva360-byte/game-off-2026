import path from 'node:path';

export function resolveAssetPath(root, requestUrl) {
  let reqPath;
  try {
    reqPath = decodeURIComponent(requestUrl.split('?')[0]);
  } catch {
    return { status: 400 };
  }
  if (reqPath.includes('\0')) return { status: 400 };
  // Treat backslashes as separators on every OS, not just Windows.
  reqPath = reqPath.replaceAll('\\', '/');
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.resolve(root, `.${reqPath.startsWith('/') ? '' : '/'}${reqPath}`);
  const relative = path.relative(root, filePath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return { status: 403 };
  }
  return { status: 200, filePath, reqPath };
}
