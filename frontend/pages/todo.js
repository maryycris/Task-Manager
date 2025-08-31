import { useEffect, useState } from 'react';
import Layout from './_layout';

const STATUS = ['pending', 'in-progress', 'completed'];
const API_URL = 'http://localhost:3001/api/tasks';

function StatusBadge({ status }) {
  const colorClass = status === 'pending' ? 'status-badge status-pending'
    : status === 'in-progress' ? 'status-badge status-in-progress'
      : status === 'completed' ? 'status-badge status-completed'
        : 'status-badge';
  return <span className={colorClass} style={{ textTransform: 'capitalize' }}>{status}</span>;
}

function EditModal({ show, onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState(initial?.status || STATUS[0]);

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setStatus(initial?.status || STATUS[0]);
  }, [initial]);

  if (!show) return null;
  return (
    <div style={{position:'fixed', left:0, top:0, width:'100vw', height:'100vh', background:'#a487e577', zIndex:11, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <form onSubmit={e => { e.preventDefault(); onSave({ title, description, status }); }} style={{background:'#fff', padding:36, borderRadius:17, minWidth:340, boxShadow:'0 8px 40px #8c7bb733', display:'flex', flexDirection:'column', gap:19, position:'relative', animation:'showmodal .25s'}}>
        <button type="button" onClick={onClose} style={{position:'absolute',top:8, right:11, background:'none', color:'#a594e9', fontWeight:800, fontSize:'1.22em', border:'none', cursor:'pointer'}}>×</button>
        <h2 style={{margin:'0 0 8px', color:'#6d549f', fontWeight:700, textAlign:'center'}}>Edit Task</h2>
        <label style={{fontWeight:500, color:'#6d549f'}}>Title
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{padding:9, fontWeight:500, marginTop:2, width:'100%'}} required />
        </label>
        <label style={{fontWeight:500, color:'#6d549f'}}>Description
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" style={{padding:9, fontWeight:500, marginTop:2, width:'100%'}} required />
        </label>
        <label style={{fontWeight:500, color:'#6d549f'}}>Status
          <select value={status} onChange={e => setStatus(e.target.value)} style={{padding:9, marginTop:2, width:'100%'}}>
            {STATUS.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </label>
        <button type="submit" style={{marginTop:7}}>Save Changes</button>
      </form>
      <style>{`
        @keyframes showmodal {0%{opacity:.7;transform:scale(.98);}100%{opacity:1;transform:scale(1);}}
      `}</style>
    </div>
  );
}

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [editData, setEditData] = useState(null); // { _id, title, description, status }
  const [noti, setNoti] = useState('');

  function toast(msg) {
    setNoti(msg);
    setTimeout(() => setNoti(''), 2000);
  }

  // Fetch tasks from API
  const fetchTasks = async (searchQ = search, statusQ = filter) => {
    setLoading(true);
    let url = API_URL + '?';
    if (searchQ) url += `search=${encodeURIComponent(searchQ)}&`;
    if (statusQ) url += `status=${statusQ}&`;
    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  // Add task
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return toast("Title/description required");
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status }),
    });
    setTitle(''); setDescription(''); setStatus('pending');
    toast("Task added!");
    fetchTasks();
  };

  // Delete task (with confirm)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    toast("Task deleted!");
    fetchTasks();
  };

  // Edit/Update (open modal)
  const handleEditInit = (t) => {
    setEditData(t);
  };
  const handleEditSave = async ({ title, description, status }) => {
    await fetch(`${API_URL}/${editData._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status })
    });
    setEditData(null);
    toast("Task updated!");
    fetchTasks();
  };

  // Filter & search
  const handleFilter = (status) => { setFilter(status); fetchTasks(search, status); };
  const handleSearch = (e) => { setSearch(e.target.value); fetchTasks(e.target.value, filter); };

  return (
    <Layout>
      <h1 style={{ fontWeight: 650, letterSpacing: '.5px' }}>To-do</h1>
      {noti && <div className="noti-toast">{noti}</div>}
      <EditModal show={!!editData} onClose={()=>setEditData(null)} onSave={handleEditSave} initial={editData} />
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', boxShadow:'0 2px 8px #cecbf8', background:'#fff', borderRadius:12, padding:16 }}>
        <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{ flex: 2, padding: 9, fontWeight:500 }} />
        <input required value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" style={{ flex: 3, padding: 9, fontWeight:500 }} />
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1, padding: 9, minWidth:120 }}>
          {STATUS.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button type="submit" style={{}}>Add</button>
      </form>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent:'flex-end' }}>
        <input value={search} onChange={handleSearch} placeholder="Search tasks..." style={{ padding: 9, width: '230px', borderColor: '#beb6da', fontWeight:500 }} />
        <select value={filter} onChange={e => handleFilter(e.target.value)} style={{ padding: 9, minWidth:120, borderColor: '#beb6da', fontWeight:500 }}>
          <option value="">All Status</option>
          {STATUS.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      {(loading ? <p style={{color:'#6762ac', fontWeight:600,}}>Loading...</p> : tasks.length === 0 ? <p style={{color:'#888', fontWeight:500}}>No tasks found.</p> : (
        <div style={{borderRadius:12, boxShadow:'0 3px 16px #e1e1f2', overflow:'hidden', background:'#fff'}}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#efebfb' }}>
                <th style={{ padding: 12, border: 'none' }}>Title</th>
                <th style={{ padding: 12, border: 'none' }}>Description</th>
                <th style={{ padding: 12, border: 'none' }}>Status</th>
                <th style={{ padding: 12, border: 'none' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t._id}>
                  <td style={{ padding: 12, border: 'none', fontWeight:500 }}>{t.title}</td>
                  <td style={{ padding: 12, border: 'none', color:'#58616b' }}>{t.description}</td>
                  <td style={{ padding: 12, border: 'none' }}><StatusBadge status={t.status} /></td>
                  <td style={{ padding: 8, border: 'none' }}>
                    <button onClick={() => handleEditInit(t)} style={{ padding: '7px 13px', marginRight: 7, fontWeight:500 }}>Edit</button>
                    <button onClick={() => handleDelete(t._id)} style={{ padding: '7px 13px', background:'#f9bbc9', color:'#94233a', fontWeight:500 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </Layout>
  );
}
