import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EmployeeForm from './EmployeeForm'

const API = import.meta.env.VITE_API_BASE || 'https://hrms-lite-backend-2fvs.onrender.com/api'

export default function EmployeeList({onViewAttendance}){
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    try{
      const res = await axios.get(`${API}/employees`)
      setEmployees(res.data)
    }catch(e){
      console.error('Error fetching employees:', e)
      alert('Error loading employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ fetchEmployees() }, [])

  const handleAdd = (emp) => {
    setEmployees(prev => [emp, ...prev])
  }

  const handleDelete = async (id, empId)=>{
    if (!confirm(`Are you sure you want to delete employee ${empId}?`)) return
    
    try{
      await axios.delete(`${API}/employees/${id}`)
      setEmployees(prev => prev.filter(e => e._id !== id))
      alert('Employee deleted successfully')
    }catch(e){
      console.error('Error deleting employee:', e)
      alert('Error deleting employee')
    }
  }

  if (loading) {
    return <div>Loading employees...</div>
  }

  return (
    <div>
      <EmployeeForm onAdd={handleAdd} />
      
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
        <h2>Employee List ({employees.length})</h2>
      </div>
      
      {employees.length === 0 ? (
        <div style={{textAlign:'center', padding:'40px', color:'#666'}}>
          <p>No employees found. Add your first employee above.</p>
        </div>
      ) : (
        <div style={{overflowX:'auto'}}>
          <table className="emp-table" style={{width:'100%', borderCollapse:'collapse', backgroundColor:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
            <thead>
              <tr style={{backgroundColor:'#f8f9fa'}}>
                <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Employee ID</th>
                <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Full Name</th>
                <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Department</th>
                <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Email</th>
                <th style={{padding:'12px', textAlign:'center', borderBottom:'2px solid #dee2e6'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
            {employees.map((e, index) => (
              <tr key={e._id} style={{backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'}}>
                <td style={{padding:'12px', borderBottom:'1px solid #dee2e6'}}>
                  <strong>{e.employee_id}</strong>
                </td>
                <td style={{padding:'12px', borderBottom:'1px solid #dee2e6'}}>{e.full_name}</td>
                <td style={{padding:'12px', borderBottom:'1px solid #dee2e6'}}>
                  {e.department || <span style={{color:'#999'}}>Not specified</span>}
                </td>
                <td style={{padding:'12px', borderBottom:'1px solid #dee2e6'}}>
                  {e.email || <span style={{color:'#999'}}>Not provided</span>}
                </td>
                <td style={{padding:'12px', borderBottom:'1px solid #dee2e6', textAlign:'center'}}>
                  <button 
                    onClick={()=>onViewAttendance && onViewAttendance(e.employee_id)}
                    style={{
                      padding:'6px 12px', 
                      backgroundColor:'#007bff', 
                      color:'white', 
                      border:'none', 
                      borderRadius:'4px', 
                      cursor:'pointer',
                      marginRight:'8px'
                    }}
                  >
                    View Attendance
                  </button>
                  <button 
                    onClick={()=>handleDelete(e._id, e.employee_id)}
                    style={{
                      padding:'6px 12px', 
                      backgroundColor:'#dc3545', 
                      color:'white', 
                      border:'none', 
                      borderRadius:'4px', 
                      cursor:'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
