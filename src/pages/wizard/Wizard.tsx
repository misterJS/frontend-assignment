import { useEffect, useState } from 'react'
import { useRole } from '../../lib/useRole'
import Step1, { type Step1Values } from './Step1'
import Step2, { type Step2Values } from './Step2'

type Step = 1 | 2

const Wizard = () => {
  const { role } = useRole()
  const [step, setStep] = useState<Step>(role === 'admin' ? 1 : 2)
  const [step1Values, setStep1Values] = useState<Step1Values>({
    phone: '',
    emergencyContact: '',
  })
  const [step2Values, setStep2Values] = useState<Step2Values>({
    department: null,
    location: null,
    photoDataUrl: null,
    notes: '',
  })

  useEffect(() => {
    setStep(role === 'admin' ? 1 : 2)
  }, [role])

  const handleStep1Change = (next: Step1Values) => {
    setStep1Values(next)
  }

  const handleStep2Change = (next: Step2Values) => {
    setStep2Values(next)
  }

  const handleStep1Next = () => {
    setStep(2)
  }

  const handleStep2Submit = () => {
    // Simpan ke store/API di implementasi berikutnya
    console.log('Submit wizard data', {
      role,
      step1: step1Values,
      step2: step2Values,
    })
  }

  const handleBack = () => {
    if (role !== 'admin') return
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))
  }

  const isBackVisible = role === 'admin' && step > 1

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
        {step === 1 && role === 'admin' ? (
          <Step1
            value={step1Values}
            onChange={handleStep1Change}
            onNext={handleStep1Next}
          />
        ) : (
          <Step2
            role={role}
            value={step2Values}
            onChange={handleStep2Change}
            onSubmit={handleStep2Submit}
          />
        )}
      </div>

      {isBackVisible && (
        <button type="button" onClick={handleBack}>
          Back
        </button>
      )}
    </section>
  )
}

export default Wizard
