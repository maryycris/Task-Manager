import Navigation from '../components/Navigation';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <main style={{ flex: 1, padding: 32, background: '#fafbff' }}>{children}</main>
    </div>
  );
}
