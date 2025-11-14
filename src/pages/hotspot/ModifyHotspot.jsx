import React, { useState, useEffect } from 'react';
import './HotspotPackages.css';

export default function ModifyHotspotPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = no form, or package object
  const [message, setMessage] = useState('');

  const durationUnits = ['hours', 'days', 'weeks'];

  useEffect(() => {
    // simulate API load
    setTimeout(() => {
      setPackages([]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    if (!form.name || form.price < 0 || !form.duration) {
      setMessage('Please fill all required fields correctly');
      return;
    }

    // Validate maximum 30 days
    let totalDays = form.duration;
    if (form.durationUnit === 'hours') totalDays = form.duration / 24;
    if (form.durationUnit === 'weeks') totalDays = form.duration * 7;

    if (totalDays > 30) {
      setMessage('Duration cannot exceed 30 days');
      return;
    }

    setPackages(prev => form.id 
      ? prev.map(p => p.id === form.id ? form : p) 
      : [...prev, {...form,id:Date.now(),usage:0}]
    );
    setForm(null);
    setMessage('Package saved successfully');
  };

  if (loading) return <div className="center">Loading...</div>;

  return (
    <div className="page">
      <h1>Hotspot Packages</h1>
      {message && <div className="alert">{message}</div>}

      <button onClick={()=>setForm({name:'',duration:1,durationUnit:'hours',price:0,bandwidth:'',dataLimit:'',isActive:true})}>Add Package</button>

      {form && (
        <div className="form">
          <div className="form-group">
            <label>Package Name</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e=>setForm({...form,name:e.target.value})} 
              placeholder="Enter package name"
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <input 
                type="number" 
                min="1" 
                value={form.duration} 
                onChange={e=>setForm({...form,duration:parseInt(e.target.value)||1})} 
              />
              <select 
                value={form.durationUnit} 
                onChange={e=>setForm({...form,durationUnit:e.target.value})}
              >
                {durationUnits.map(u=> <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Price (KSh)</label>
            <input 
              type="number" 
              min="0" 
              value={form.price} 
              onChange={e=>setForm({...form,price:parseFloat(e.target.value)||0})} 
            />
          </div>

          <div className="form-group">
            <label>Bandwidth</label>
            <input 
              type="text" 
              value={form.bandwidth} 
              onChange={e=>setForm({...form,bandwidth:e.target.value})} 
              placeholder="e.g., 5Mbps"
            />
          </div>

          <div className="form-actions">
            <button onClick={()=>setForm(null)}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Duration</th><th>Price</th><th>Bandwidth</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(p=>(
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.duration} {p.durationUnit}</td>
              <td>{p.price}</td>
              <td>{p.bandwidth}</td>
              <td>{p.isActive?'Active':'Inactive'}</td>
              <td>
                <button onClick={()=>setForm(p)}>Edit</button>
                <button onClick={()=>setPackages(prev => prev.filter(pkg => pkg.id!==p.id))}>Delete</button>
                <button onClick={()=>setPackages(prev => prev.map(pkg => pkg.id===p.id?{...pkg,isActive:!pkg.isActive}:pkg))}>
                  {p.isActive?'Deactivate':'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
