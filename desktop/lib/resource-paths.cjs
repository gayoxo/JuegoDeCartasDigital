const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_ORIGIN = 'rally://app';

function resolveAssetPath(distRoot, requestUrl) {
  if (typeof requestUrl !== 'string' || !requestUrl.startsWith(`${APP_ORIGIN}/`)) {
    throw new Error('Origen rally no autorizado');
  }

  const withoutOrigin = requestUrl.slice(APP_ORIGIN.length);
  const rawPath = withoutOrigin.split(/[?#]/, 1)[0];
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    throw new Error('Ruta codificada no válida');
  }

  if (decoded.includes('\0') || decoded.includes('\\')) {
    throw new Error('Ruta local no válida');
  }
  if (/%(?:2e|2f|5c|00)/i.test(decoded)) {
    throw new Error('Ruta codificada de forma ambigua');
  }

  const segments = decoded.split('/');
  if (segments.some((segment) => segment === '..')) {
    throw new Error('Escape del directorio de recursos');
  }

  const relative = decoded === '/' || decoded === '' ? 'index.html' : decoded.replace(/^\/+/, '');
  const root = path.resolve(distRoot);
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error('Escape del directorio de recursos');
  }
  return resolved;
}

function createProtocolHandler(distRoot, net) {
  return async (request) => {
    try {
      const filePath = resolveAssetPath(distRoot, request.url);
      return net.fetch(pathToFileURL(filePath).toString());
    } catch (error) {
      return new Response(error.message, { status: 403 });
    }
  };
}

module.exports = { APP_ORIGIN, createProtocolHandler, resolveAssetPath };

