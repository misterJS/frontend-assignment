import { useEffect, useState } from 'react'
import { useRole } from '../../lib/useRole'
import type { Role } from '../../lib/role'

type Step = 1 | 2

const StepTitle = ({ step }: { step: Step }) => {
  const titles: Record<Step, string> = {
    1: 'Step 1 - Basic Information',
    2: 'Step 2 - Additional Details',
  }

  return <h2 style={{ marginBottom: '0.5rem' }}>{titles[step]}</h2>
}

const Step1 = () => {
  return (
    <div>
      <StepTitle step={1} />
      <p style={{ margin: 0 }}>
        Halaman ini hanya dapat diakses oleh role <strong>admin</strong>.
      </p>
      <p style={{ marginTop: '0.5rem' }}>
        Tambahkan form Basic Info di sini (placeholder sementara).
      </p>
    </div>
  )
}

const Step2 = ({ role }: { role: Role }) => {
  return (
    <div>
      <StepTitle step={2} />
      <p style={{ margin: 0 }}>
        Step 2 terlihat oleh semua role. Role aktif: <strong>{role}</strong>.
      </p>
      <p style={{ marginTop: '0.5rem' }}>
        Tambahkan form Detail atau review summary pada bagian ini.
      </p>
    </div>
  )
}

const Wizard = () => {
  const { role } = useRole()
  const [step, setStep] = useState<Step>(role === 'admin' ? 1 : 2)

  useEffect(() => {
    setStep(role === 'admin' ? 1 : 2)
  }, [role])

  const handleNext = () => {
    setStep((prev) => (prev < 2 ? ((prev + 1) as Step) : prev))
  }

  const handleBack = () => {
    if (role !== 'admin') return
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))
  }

  const isBackVisible = role === 'admin' && step > 1
  const isNextDisabled = step === 2

  return (
    <section>
      <h1 style={{ marginBottom: '1rem' }}>Wizard Simulasi</h1>
      <div
        style={{
          border: '1px solid #cbd5f5',
          borderRadius: 8,
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        {step === 1 ? <Step1 /> : <Step2 role={role} />}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {isBackVisible && (
          <button type="button" onClick={handleBack}>
            Back
          </button>
        )}
        <button type="button" onClick={handleNext} disabled={isNextDisabled}>
          Next
        </button>
      </div>
    </section>
  )
}

export default Wizard
