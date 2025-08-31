import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', text: 'Home', icon: '🏠' },
  { href: '/todo', text: 'To-do', icon: '✅' }
];

export default function Navigation() {
  const router = typeof window !== 'undefined' ? require('next/router').useRouter() : { pathname: '' };
  const pathname = router.pathname || '';

  return (
    <nav style={{
      padding: 16,
      borderRight: '1px solid #ece7fa',
      minWidth: 230,
      height: '100vh',
      boxSizing: 'border-box',
      background: 'linear-gradient(142deg, #e2daff 10%, #faf8ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky', top: 0
    }}>
      <span style={{marginBottom: '2.5rem', fontWeight:700, fontSize:'1.35rem', color:'#7d5dd2', paddingLeft:4, letterSpacing:'.2px'}}>TaskManager</span>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex:1 }}>
        {navItems.map(i => (
          <li key={i.text} style={{marginBottom:6}}>
            <Link href={i.href} legacyBehavior>
              <a style={{
                display: 'flex', alignItems: 'center', textDecoration:'none', padding: '11px 18px', margin:'0 -8px', borderRadius: 8,
                fontWeight: pathname===i.href?700:510,
                background: pathname===i.href?
                  'linear-gradient(90deg, #b993f0 12%, #cab3fe 70%)' : 'none',
                color: pathname===i.href?'#361962':'#635899',
                boxShadow: pathname===i.href?'0 2px 12px #eee0fa':''
              }}>
                <span style={{fontSize:'1.23rem', marginRight:10}}>{i.icon}</span>
                {i.text}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div style={{margin:'auto 0 16px 0',textAlign:'center',color:'#beb2ed',fontSize:'0.99em'}}>Powered by Next.js</div>
    </nav>
  );
}
