import React, {useEffect, useState} from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export default function Attendance({employeeIdProp}){
  const [employees, setEmployees] = useState([])
  const [employeeId, setEmployeeId] = useState(employeeIdProp || '')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('Present')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchEmployees() }, [])
  useEffect(()=>{ 
    if(employeeIdProp) {
      setEmployeeId(employeeIdProp)
      fetchRecords(employeeIdProp)
    }
  }, [employeeIdProp])

  const fetchEmployees = async ()=>{
    try{ 
      const res = await axios.get(`${API}/employees`)
      setEmployees(res.data) 
    }catch(e){
      console.error('Error fetching employees:', e)
    }
  }

  const fetchRecords = async (emp)=>{
    if(!emp) return setRecords([])
    try{ 
      const res = await axios.get(`${API}/attendance?employee_id=${emp}`)
      setRecords(res.data) 
    }catch(e){
      console.error('Error fetching records:', e)
    }
  }

  const handleMark = async (e)=>{
    e.preventDefault()
    if(!employeeId || !date) {
      alert('Please select employee and date')
      return
    }
    
    setLoading(true)
    try{
      await axios.post(`${API}/attendance`, { 
        employee_id: employeeId, 
        date: date, 
        status: status 
      })
      fetchRecords(employeeId)
      alert('Attendance marked successfully!')
    }catch(err){
      console.error('Error marking attendance:', err)
      alert('Error marking attendance')
    } finally {
      setLoading(false)
    }
  }

  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e.employee_id === empId)
    return emp ? emp.full_name : empId
  }

  return (
    <div>
      <h2>Attendance Management</h2>
      
      {/* Mark Attendance Form */}
      <div className="attendance-form" style={{background:'#f5f5f5', padding:'20px', borderRadius:'8px', marginBottom:'20px'}}>
        <h3>Mark Attendance</h3>
        <div style={{display:'flex',gap:'15px',alignItems:'center', flexWrap:'wrap'}}>
          <div>
            <label>Employee:</label>
            <select 
              value={employeeId} 
              onChange={e=>{setEmployeeId(e.target.value); fetchRecords(e.target.value)}}
              style={{marginLeft:'8px', padding:'5px'}}
            >
              <option value="">-- Select Employee --</option>
              {employees.map(emp=> 
                <option key={emp._id} value={emp.employee_id}>
                  {emp.employee_id} — {emp.full_name}
                </option>
              )}
            </select>
          </div>
          
          <div>
            <label>Date:</label>
            <input 
              type="date" 
              value={date} 
              onChange={e=>setDate(e.target.value)}
              style={{marginLeft:'8px', padding:'5px'}}
            />
          </div>
          
          <div>
            <label>Status:</label>
            <select 
              value={status} 
              onChange={e=>setStatus(e.target.value)}
              style={{marginLeft:'8px', padding:'5px'}}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          
          <button 
            onClick={handleMark} 
            disabled={loading}
            style={{padding:'8px 16px', backgroundColor:'#007bff', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}
          >
            {loading ? 'Marking...' : 'Mark Attendance'}
          </button>
        </div>
      </div>

      {/* Attendance Records */}
      {employeeId && (
        <div>
          <h3>Attendance Records for {getEmployeeName(employeeId)}</h3>
          {records.length > 0 ? (
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r=> (
                  <tr key={r._id}>
                    <td>{r.date}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor: r.status === 'Present' ? '#28a745' : '#dc3545'
                      }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No attendance records found for this employee.</p>
          )}
        </div>
      )}
    </div>
  )
}
