import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'https://hrms-lite-backend-2fvs.onrender.com/api'

export default function EmployeeForm({onAdd}){
  const [employeeId, setEmployeeId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) =>{
    e.preventDefault()
    if (!employeeId.trim() || !fullName.trim()) {
      alert('Employee ID and Full Name are required')
      return
    }
    
    setLoading(true)
    try{
      const payload = { 
        employee_id: employeeId.trim(), 
        full_name: fullName.trim(), 
        email: email.trim(), 
        department: department.trim() 
      }
      const res = await axios.post(`${API}/employees`, payload)
      onAdd(res.data)
      setEmployeeId(''); setFullName(''); setEmail(''); setDepartment('')
      alert('Employee added successfully!')
    }catch(err){
      console.error(err)
      const errorMsg = err?.response?.data?.error || err?.message || 'Error adding employee'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="employee-form-container" style={{background:'#f8f9fa', padding:'20px', borderRadius:'8px', marginBottom:'20px'}}>
      <h3>Add New Employee</h3>
      <form onSubmit={submit} className="employee-form">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
          <div>
            <label>Employee ID *</label>
            <input 
              value={employeeId} 
              onChange={e=>setEmployeeId(e.target.value)} 
              placeholder="e.g., EMP001" 
              required 
              style={{width:'100%', padding:'8px', marginTop:'4px', border:'1px solid #ddd', borderRadius:'4px'}}
            />
          </div>
          <div>
            <label>Full Name *</label>
            <input 
              value={fullName} 
              onChange={e=>setFullName(e.target.value)} 
              placeholder="Enter full name" 
              required 
              style={{width:'100%', padding:'8px', marginTop:'4px', border:'1px solid #ddd', borderRadius:'4px'}}
            />
          </div>
          <div>
            <label>Email Address</label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="employee@company.com" 
              style={{width:'100%', padding:'8px', marginTop:'4px', border:'1px solid #ddd', borderRadius:'4px'}}
            />
          </div>
          <div>
            <label>Department</label>
            <select 
              value={department} 
              onChange={e=>setDepartment(e.target.value)}
              style={{width:'100%', padding:'8px', marginTop:'4px', border:'1px solid #ddd', borderRadius:'4px'}}
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding:'10px 20px', 
            backgroundColor:'#28a745', 
            color:'white', 
            border:'none', 
            borderRadius:'4px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  )
}
