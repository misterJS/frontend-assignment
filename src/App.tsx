import { type CSSProperties } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import EmployeesPage from './pages/employees'
import WizardPage from './pages/wizard'
import { RoleProvider } from './lib/role-context'
import { useRole } from './lib/useRole'
import type { Role } from './lib/role'

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderBottom: '1px solid #e2e8f0',
  marginBottom: '1rem',
  fontSize: '0.9rem',
}

const buttonBaseStyle: CSSProperties = {
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  border: '1px solid #94a3b8',
  background: 'transparent',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const getButtonStyle = (active: boolean): CSSProperties => ({
  ...buttonBaseStyle,
  backgroundColor: active ? '#2563eb' : 'transparent',
  color: active ? '#fff' : '#0f172a',
  borderColor: active ? '#2563eb' : '#94a3b8',
})

const roleLabels: Record<Role, string> = {
  ops: 'Ops',
  admin: 'Admin',
}

const RoleToggle = () => {
  const { role, setRole } = useRole()
  const roles: Role[] = ['ops', 'admin']

  return (
    <header style={headerStyle}>
      <strong>Role:</strong>
      {roles.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setRole(item)}
          style={getButtonStyle(role === item)}
          aria-pressed={role === item}
        >
          {roleLabels[item]}
        </button>
      ))}
      <span style={{ marginLeft: 'auto', color: '#475569' }}>
        atau tambahkan ?role=ops|admin pada URL
      </span>
    </header>
  )
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/wizard" replace />} />
    <Route path="/wizard" element={<WizardPage />} />
    <Route path="/employees" element={<EmployeesPage />} />
  </Routes>
)

const App = () => {
  return (
    <RoleProvider>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <RoleToggle />
        <AppRoutes />
      </div>
    </RoleProvider>
  )
}

export default App
