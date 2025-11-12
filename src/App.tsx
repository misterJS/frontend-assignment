import { Navigate, Route, Routes } from 'react-router-dom'
import EmployeesPage from './pages/employees'
import WizardPage from './pages/wizard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/wizard" replace />} />
      <Route path="/wizard" element={<WizardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
    </Routes>
  )
}

export default App
