import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('sw.js');
      wb.register();
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;