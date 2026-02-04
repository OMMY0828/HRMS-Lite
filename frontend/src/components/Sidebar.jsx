import React from 'react'

export default function Sidebar({onNavigate, currentPage}){
  const getButtonStyle = (page) => ({
    width: '100%',
    padding: '12px 16px',
    marginBottom: '10px',
    backgroundColor: currentPage === page ? '#495057' : 'transparent',
    color: 'white',
    border: '1px solid #495057',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'all 0.2s'
  })

  return (
    <div className="sidebar" style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#343a40',
      color: 'white',
      padding: '20px',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <h3 style={{marginBottom: '30px', color: '#fff', borderBottom: '2px solid #495057', paddingBottom: '10px'}}>HRMS Lite</h3>
      
      <nav>
        <button 
          onClick={()=>onNavigate('employees')}
          style={getButtonStyle('employees')}
          onMouseOver={e => currentPage !== 'employees' && (e.target.style.backgroundColor = '#495057')}
          onMouseOut={e => currentPage !== 'employees' && (e.target.style.backgroundColor = 'transparent')}
        >
          👥 Employee Management
        </button>
        
        <button 
          onClick={()=>onNavigate('attendance')}
          style={getButtonStyle('attendance')}
          onMouseOver={e => currentPage !== 'attendance' && (e.target.style.backgroundColor = '#495057')}
          onMouseOut={e => currentPage !== 'attendance' && (e.target.style.backgroundColor = 'transparent')}
        >
          📅 Attendance Management
        </button>
      </nav>
      
      <div style={{position: 'absolute', bottom: '20px', fontSize: '12px', color: '#adb5bd'}}>
        HRMS Lite v1.0
      </div>
    </div>
  )
}