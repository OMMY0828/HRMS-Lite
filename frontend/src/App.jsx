import React, {useState} from 'react'
import Sidebar from './components/Sidebar'
import EmployeeList from './components/EmployeeList'
import Attendance from './components/Attendance'

export default function App(){
  const [page, setPage] = useState('employees')
  const [viewEmployee, setViewEmployee] = useState('')

  const handleNavigate = (p) => { setPage(p); setViewEmployee('') }
  const handleViewAttendance = (empId) => { setViewEmployee(empId); setPage('attendance') }

  return (
    <div className="app-root" style={{display: 'flex', minHeight: '100vh'}}>
      <Sidebar onNavigate={handleNavigate} currentPage={page} />
      <div className="container" style={{
        marginLeft: '250px',
        padding: '20px',
        width: 'calc(100% - 250px)',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h1 style={{marginBottom: '30px', color: '#343a40'}}>
            {page === 'employees' ? 'Employee Management' : 'Attendance Management'}
          </h1>
          {page === 'employees' && <EmployeeList onViewAttendance={handleViewAttendance} />}
          {page === 'attendance' && <Attendance employeeIdProp={viewEmployee} />}
        </div>
      </div>
    </div>
  )
}
