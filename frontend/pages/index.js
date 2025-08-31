import { useEffect, useState } from 'react';
import Layout from './_layout';

const API_URL = 'http://localhost:3001/api/tasks';
const STATUS = [
  { key: 'pending', label: 'Pending', color: '#ffc857' },
  { key: 'in-progress', label: 'In Progress', color: '#339dff' },
  { key: 'completed', label: 'Completed', color: '#38b953' }
];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [statCounts, setStatCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
        const c = {};
        STATUS.forEach(s => c[s.key] = 0);
        data.forEach(t => { c[t.status] = (c[t.status] || 0) + 1 });
        setStatCounts({ ...c, total: data.length });
      });
  }, []);

  return (
    <Layout>
      <div style={{marginBottom:40}}>
        <h1 style={{ fontWeight: 700, color:'#624d93', margin:0, fontSize:'2.3rem', letterSpacing:'.8px' }}>Task Manager Dashboard</h1>
        <p style={{color:'#654', fontWeight:500, margin:0}}>Welcome! 👋 Manage, track, and complete your daily tasks smartly.</p>
      </div>
      {/* Stats row */}
      <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:30 }}>
        <DashCard title="All Tasks" color="#7f53ac" value={statCounts.total || 0} icon="📝" />
        {STATUS.map(s => <DashCard key={s.key} title={s.label} color={s.color} value={statCounts[s.key] || 0} icon={s.key==='pending'?"⏳":s.key==='in-progress'?"🚧":"✅"} />)}
      </div>
      {/* Recent tasks */}
      <div style={{marginTop:32}}>
        <h2 style={{marginBottom:18, color:'#4b2985', letterSpacing:'.3px'}}>Recent Tasks</h2>
        {loading ? <span>Loading...</span> : (tasks.length ? <ul style={{listStyle:'none', padding:0, margin:0}}>
          {tasks.slice(0,5).map(t => (
            <li key={t._id} style={{background:'#fff', borderRadius:12, boxShadow:'0 1px 4px #ebe5f9', marginBottom:14, padding:'15px 20px'}}>
              <span style={{fontWeight:600, fontSize:'1rem', color:'#7f53ac', marginRight:13}}>{t.title}</span>
              <span style={{fontSize:'.99em', color:'#585879'}}>{t.description}</span>
              <span style={{display:'inline-block',marginLeft:16}} className={
                t.status === 'pending' ? 'status-badge status-pending' :
                t.status === 'in-progress' ? 'status-badge status-in-progress' :
                t.status === 'completed' ? 'status-badge status-completed' : ''}>{t.status}</span>
            </li>
          ))}
        </ul> : <span>No tasks yet. Add some on the To-do page!</span>)}
      </div>
    </Layout>
  );
}

function DashCard({ title, value, color, icon }) {
  return (
    <div style={{ flex:'1 1 170px', background:'#fff', borderRadius:13, boxShadow:'0 2.5px 8px #ded9fa', padding:'21px 32px 17px 25px', display:'flex',flexDirection:'column', gap:7, alignItems:'flex-start', justifyContent:'center', minWidth:155 }}>
      <span style={{fontSize:'2.15rem'}}>{icon}</span>
      <span style={{fontWeight:700, fontSize:'1.5rem', color}}>{value}</span>
      <span style={{ color:'#4b2985', fontWeight:600, fontSize:'.99em', letterSpacing:'.5px' }}>{title}</span>
    </div>
  );
}
