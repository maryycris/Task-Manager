import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  // Only allow routes: / (Home) and /todo, otherwise redirect to Home
  if (typeof window !== 'undefined') {
    const allowed = ['/', '/todo'];
    if (!allowed.includes(window.location.pathname)) {
      window.location.replace('/');
      return null;
    }
  }
  return <Component {...pageProps} />
}
