import { Navigate, Route, Routes } from 'react-router-dom'
import EmployeesPage from './pages/employees'
import WizardPage from './pages/wizard'
import { RoleProvider } from './lib/role-context'
import { useRole } from './lib/useRole'
import type { Role } from './lib/role'

const roleLabels: Record<Role, string> = {
  ops: 'Ops',
  admin: 'Admin',
}

const RoleToggle = () => {
  const { role, setRole } = useRole()
  const roles: Role[] = ['ops', 'admin']

  return (
    <header className="role-toggle">
      <strong className="role-toggle__label">Role:</strong>
      {roles.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setRole(item)}
          className={`role-toggle__button${
            role === item ? ' role-toggle__button--active' : ''
          }`}
          aria-pressed={role === item}
        >
          {roleLabels[item]}
        </button>
      ))}
      <span className="role-toggle__hint">
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
      <div className="app-shell">
        <RoleToggle />
        <AppRoutes />
      </div>
    </RoleProvider>
  )
}

export default App
