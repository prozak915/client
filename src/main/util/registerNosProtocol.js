import url from 'url';
import { protocol } from 'electron';

import resolve from './resolve';

export default function registerNosProtocol() {
  protocol.registerHttpProtocol('nos', async (request, callback) => {
    try {
      const resolvedUrl = await resolve(url.parse(request.url));
      const result = Object.assign({}, request, { url: resolvedUrl });
      callback(result);
    } catch (error) {
      callback({ error });
    }
  });
}
