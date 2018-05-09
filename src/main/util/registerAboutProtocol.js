import { protocol } from 'electron';
import ReactDOMServer from 'react-dom/server';

const PAGES = {
  'about:blank': '../about/blank'
};

function getBaseURL(href) {
  return href.split(/#|\?/)[0];
}

function getPage(href) {
  const page = PAGES[getBaseURL(href)];

  if (!page) {
    throw new Error('Not found.');
  }

  return page;
}

export default function registerAboutProtocol() {
  protocol.registerStringProtocol('about', async (request, callback) => {
    try {
      console.log('url:', request.url);
      const page = getPage(request.url); // || getPage('about:error');
      console.log('page:', page);
      const data = ReactDOMServer.renderToString(page);
      console.log('data:', data);
      callback({ data, mimeType: 'text/html', charset: 'utf-8' });
    } catch (error) {
      callback({ error });
    }
  });
}
