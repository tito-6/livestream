import type { AppProps } from 'next/app';
import '../styles/globals.css';

function OasisApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default OasisApp;

